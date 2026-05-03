const { Buffer } = require('buffer');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ text: "Method Not Allowed" });

  const { prompt, mode = 'chat', textToSpeak } = req.body;
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    groq: process.env.GROQ_API_KEY,
    hf: process.env.HF_TOKEN,
  };

  // Helper to handle 503 "Model Loading" errors from Hugging Face
  async function fetchWithRetry(url, options, retries = 3) {
    for (let i = 0; i < retries; i++) {
      const response = await fetch(url, options);
      if (response.status !== 503) return response;
      await new Promise(resolve => setTimeout(resolve, 3000)); 
    }
    return fetch(url, options);
  }

  // --- Text-to-Speech Logic ---
  if (textToSpeak) {
    try {
      const ttsResp = await fetchWithRetry("https://api-inference.huggingface.co/models/microsoft/speecht5_tts", {
        headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: textToSpeak.substring(0, 500) }),
      });
      if (!ttsResp.ok) throw new Error("TTS Engine Busy");
      const buffer = await ttsResp.arrayBuffer();
      return res.status(200).json({ data: `data:audio/mpeg;base64,${Buffer.from(buffer).toString('base64')}`, type: 'audio' });
    } catch (e) { return res.status(500).json({ text: "Voice synthesis failed." }); }
  }

  try {
    // --- Image Generation ---
    if (mode === 'image') {
      const imgResp = await fetchWithRetry("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell", {
        headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      });
      if (!imgResp.ok) throw new Error("Image API is warming up. Try again.");
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
      const vidData = await vidResp.json();
      return res.status(200).json({ data: vidData.output || vidData[0], type: 'video' });
    }

    // --- Expert Coding (Groq Llama 3.3) ---
    if (mode === 'code') {
      const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${keys.groq}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }] })
      });
      const groqData = await groqResp.json();
      return res.status(200).json({ text: groqData.choices[0].message.content });
    } 

    // --- Standard Chat (Gemini) ---
    const gemResp = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${keys.gemini}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const gemData = await gemResp.json();
    return res.status(200).json({ text: gemData.candidates[0].content.parts[0].text });

  } catch (err) {
    return res.status(500).json({ text: `System Error: ${err.message}` });
  }
}