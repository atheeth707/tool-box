import { Buffer } from 'buffer';

export default async function handler(req, res) {
  // Always return JSON to prevent frontend parsing errors
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

  const { prompt, mode = 'chat' } = req.body;
  const HF_TOKEN = process.env.HF_TOKEN;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  try {
    // --- IMAGE: Using SD-1.5 (The fastest free model) ---
    if (mode === 'image') {
      const response = await fetch("https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5", {
        headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: prompt, options: { wait_for_model: false } }),
      });

      if (response.status === 503) return res.status(200).json({ error: "System is warming up. Try again in 5 seconds." });
      if (!response.ok) throw new Error("Image service busy.");

      const buffer = await response.arrayBuffer();
      return res.status(200).json({ 
        data: `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`, 
        type: 'image' 
      });
    }

    // --- VIDEO: Optimized ModelScope ---
    if (mode === 'video') {
      const response = await fetch("https://api-inference.huggingface.co/models/ali-vilab/text-to-video-ms-1.7b", {
        headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      });

      if (!response.ok) return res.status(200).json({ error: "Video generation is currently queued." });

      const buffer = await response.arrayBuffer();
      return res.status(200).json({ 
        data: `data:video/mp4;base64,${Buffer.from(buffer).toString('base64')}`, 
        type: 'video' 
      });
    }

    // --- CHAT: Gemini 1.5 Flash (Fastest response time) ---
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const geminiData = await geminiRes.json();
    if (geminiData.error) throw new Error(geminiData.error.message);

    return res.status(200).json({ 
      text: geminiData.candidates[0].content.parts[0].text,
      type: 'text'
    });

  } catch (err) {
    return res.status(200).json({ error: "Interface connection reset. Please resend.", type: 'text' });
  }
}