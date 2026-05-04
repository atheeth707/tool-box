import { Buffer } from 'buffer';

export default async function handler(req, res) {
  // 1. Force JSON header immediately to prevent parsing errors
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Invalid Request Method" });
  }

  const { prompt, mode = 'chat' } = req.body;
  const HF_TOKEN = process.env.HF_TOKEN;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  // 2. Validation Check (Internal only, user won't see technical details)
  if (!HF_TOKEN || !GEMINI_KEY) {
    return res.status(200).json({ error: "System Configuration Missing. Check API Keys." });
  }

  try {
    // --- MODE: IMAGE (Using ultra-fast FLUX or SD) ---
    if (mode === 'image') {
      const response = await fetch("https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5", {
        headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      });

      if (response.status === 503) {
        return res.status(200).json({ error: "The Image Engine is warming up. Please try again in 30 seconds." });
      }

      const buffer = await response.arrayBuffer();
      if (buffer.byteLength < 1000) throw new Error("Invalid Image Data");

      return res.status(200).json({ 
        data: `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`, 
        type: 'image' 
      });
    }

    // --- MODE: VIDEO (Stable ModelScope) ---
    if (mode === 'video') {
      const response = await fetch("https://api-inference.huggingface.co/models/ali-vilab/text-to-video-ms-1.7b", {
        headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      });

      if (!response.ok) return res.status(200).json({ error: "Video Engine Busy. Try a shorter prompt." });

      const buffer = await response.arrayBuffer();
      return res.status(200).json({ 
        data: `data:video/mp4;base64,${Buffer.from(buffer).toString('base64')}`, 
        type: 'video' 
      });
    }

    // --- MODE: CHAT (Gemini 2.0 Flash) ---
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`, {
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
    // 3. Fallback: Always return valid JSON so the frontend never crashes
    return res.status(200).json({ 
      error: "Connection timed out. Please retry your request.", 
      type: 'text' 
    });
  }
}