import { Buffer } from 'buffer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

  const { prompt, mode = 'chat' } = req.body;
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    hf: process.env.HF_TOKEN,
  };

  try {
    if (mode === 'chat') {
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keys.gemini}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `You are Nexus, an advanced AI assistant. Your goal is to be insightful, clear, and adaptive. Answer this prompt naturally: ${prompt}` }]
          }]
        })
      });
      const data = await geminiRes.json();
      return res.status(200).json({ text: data.candidates[0].content.parts[0].text, type: 'text' });
    }

    if (mode === 'image') {
      const response = await fetch("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell", {
        headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      });
      const buffer = await response.arrayBuffer();
      return res.status(200).json({ data: `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`, type: 'image' });
    }

    if (mode === 'video') {
      const response = await fetch("https://api-inference.huggingface.co/models/ali-vilab/text-to-video-ms-1.7b", {
        headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      });
      const buffer = await response.arrayBuffer();
      return res.status(200).json({ data: `data:video/mp4;base64,${Buffer.from(buffer).toString('base64')}`, type: 'video' });
    }

  } catch (err) {
    return res.status(500).json({ error: "System overload. Please retry in a moment." });
  }
}