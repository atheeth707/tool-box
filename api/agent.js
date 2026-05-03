import { Buffer } from 'buffer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

  const { prompt, mode = 'chat', textToSpeak } = req.body;
  
  // Load API keys
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    groq: process.env.GROQ_API_KEY,
    hf: process.env.HF_TOKEN,
  };

  // 1. Strict Key Validation (Returns clean JSON to frontend if missing)
  if (textToSpeak || mode === 'image' || mode === 'video') {
    if (!keys.hf) return res.status(400).json({ error: "HuggingFace token missing. Check your .env file." });
  }
  if (mode === 'code' && !keys.groq) return res.status(400).json({ error: "Groq API key missing. Check your .env file." });
  if (mode === 'chat' && !keys.gemini) return res.status(400).json({ error: "Gemini API key missing. Check your .env file." });

  // Helper to wake up free models
  async function fetchWithRetry(url, options, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.status !== 503) return response;
        await new Promise(res => setTimeout(res, 3000));
      } catch (e) {
        if (i === retries - 1) throw e;
      }
    }
    return fetch(url, options);
  }

  try {
    // --- TTS Logic ---
    if (textToSpeak) {
      const ttsResp = await fetchWithRetry("https://api-inference.huggingface.co/models/microsoft/speecht5_tts", {
        headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: textToSpeak.substring(0, 500) }),
      });
      if (!ttsResp.ok) throw new Error(`HF TTS API Error: ${await ttsResp.text()}`);
      const buffer = await ttsResp.arrayBuffer();
      return res.status(200).json({ data: `data:audio/mpeg;base64,${Buffer.from(buffer).toString('base64')}`, type: 'audio' });
    }

    // --- Image Generation ---
    if (mode === 'image') {
      const imgResp = await fetchWithRetry("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell", {
        headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      });
      if (!imgResp.ok) throw new Error(`HF Image API Error: ${await imgResp.text()}`);
      const buffer = await imgResp.arrayBuffer();
      return res.status(200).json({ data: `data:image/webp;base64,${Buffer.from(buffer).toString('base64')}`, type: 'image' });
    }

    // --- Video Generation ---
    if (mode === 'video') {
      const vidResp = await fetchWithRetry("https://api-inference.huggingface.co/models/Wan-AI/Wan2.1-T2V-14B", {
        headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      });
      if (!vidResp.ok) throw new Error(`HF Video API Error: ${await vidResp.text()}`);
      const vidData = await vidResp.json();
      return res.status(200).json({ data: vidData.output || vidData[0] || "Video generation failed.", type: 'video' });
    }

    // --- Code Generation ---
    if (mode === 'code') {
      const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${keys.groq}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }] })
      });
      const groqData = await groqResp.json();
      if (groqData.error) throw new Error(`Groq API Error: ${groqData.error.message}`);
      return res.status(200).json({ text: groqData.choices[0].message.content });
    }

    // --- Chat Generation ---
    const gemResp = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${keys.gemini}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const gemData = await gemResp.json();
    if (gemData.error) throw new Error(`Gemini API Error: ${gemData.error.message}`);
    return res.status(200).json({ text: gemData.candidates[0].content.parts[0].text });

  } catch (err) {
    console.error("Agentic AI Error:", err);
    return res.status(500).json({ error: err.message || "The AI engine encountered an error." });
  }
}