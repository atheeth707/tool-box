const { Buffer } = require('buffer');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

  const { prompt, mode = 'chat', textToSpeak } = req.body;
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    groq: process.env.GROQ_API_KEY,
    hf: process.env.HF_TOKEN,
  };

  // Helper to wake up free models and prevent HTML error responses
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

    // --- Chat & Code Routing ---
    if (mode === 'code') {
      const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${keys.groq}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }] })
      });
      const groqData = await groqResp.json();
      return res.status(200).json({ text: groqData.choices[0].message.content });
    }

    const gemResp = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${keys.gemini}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const gemData = await gemResp.json();
    return res.status(200).json({ text: gemData.candidates[0].content.parts[0].text });

  } catch (err) {
    // Always return JSON to prevent frontend parsing errors
    return res.status(500).json({ text: "The AI engine is currently initializing. Please try again." });
  }
}