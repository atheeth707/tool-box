const { Buffer } = require('buffer');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ text: "Method Not Allowed" });

  const { prompt, mode = 'chat', textToSpeak } = req.body;
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    groq: process.env.GROQ_API_KEY,
    hf: process.env.HF_TOKEN,
  };

  // --- TTS ENGINE: Microsoft SpeechT5 ---
  if (textToSpeak) {
    try {
      const ttsResp = await fetch(
        "https://api-inference.huggingface.co/models/microsoft/speecht5_tts",
        {
          headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ inputs: textToSpeak.substring(0, 600) }),
        }
      );
      if (!ttsResp.ok) throw new Error("SpeechT5 failed.");
      const buffer = await ttsResp.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      return res.status(200).json({ data: `data:audio/mpeg;base64,${base64}`, type: 'audio' });
    } catch (e) { return res.status(500).json({ text: e.message }); }
  }

  try {
    // --- MODE: CODE (Groq Llama 3.3 70B Versatile) ---
    if (mode === 'code') {
      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${keys.groq}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          model: "llama-3.3-70b-versatile", 
          messages: [{ role: "user", content: `Write professional code: ${prompt}` }],
          temperature: 0.2 
        })
      });
      const data = await resp.json();
      return res.status(200).json({ text: data.choices[0].message.content, engine: "Llama 3.3 70B" });
    }

    // --- MODE: VIDEO (Hugging Face Wan 2.2) ---
    if (mode === 'video') {
      const resp = await fetch("https://api-inference.huggingface.co/models/Wan-AI/Wan2.1-T2V-14B", {
        headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      });
      if (!resp.ok) throw new Error("Video Gen Busy or Failed.");
      const data = await resp.json();
      return res.status(200).json({ data: data.output || data[0], type: 'video', engine: "Wan 2.2" });
    }

    // --- MODE: CHAT (Gemini 1.5 Flash - Low Cost) ---
    const gemResp = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${keys.gemini}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const gemData = await gemResp.json();
    return res.status(200).json({ text: gemData.candidates[0].content.parts[0].text, engine: "Gemini Flash" });

  } catch (err) {
    return res.status(500).json({ text: `System Error: ${err.message}` });
  }
}