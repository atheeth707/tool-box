import { Buffer } from 'buffer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

  const { prompt, mode = 'chat' } = req.body;
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    hf: process.env.HF_TOKEN,
  };

  async function fetchWithRetry(url, options, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        // Status 503 means the model is loading on HF servers
        if (response.status !== 503) return response;
        await new Promise(resolve => setTimeout(resolve, 8000));
      } catch (e) {
        if (i === retries - 1) throw e;
      }
    }
    return fetch(url, options);
  }

  try {
    // --- IMAGE: FLUX.1-schnell ---
    if (mode === 'image') {
      const imgResp = await fetchWithRetry(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        {
          headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ inputs: prompt }),
        }
      );
      if (!imgResp.ok) throw new Error(`Image API Error: ${imgResp.status}`);
      const buffer = await imgResp.arrayBuffer();
      return res.status(200).json({ data: `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`, type: 'image' });
    }

    // --- VIDEO: Stable Video Diffusion ---
    if (mode === 'video') {
      const vidResp = await fetchWithRetry(
        "https://api-inference.huggingface.co/models/stabilityai/stable-video-diffusion-img2vid-xt",
        {
          headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ inputs: prompt }),
        }
      );
      if (!vidResp.ok) throw new Error(`Video API Error: ${vidResp.status}`);
      const buffer = await vidResp.arrayBuffer();
      return res.status(200).json({ data: `data:video/mp4;base64,${Buffer.from(buffer).toString('base64')}`, type: 'video' });
    }

    // --- CHAT: Gemini 2.5 Flash ---
    const gemUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${keys.gemini}`;
    const gemResp = await fetch(gemUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const gemData = await gemResp.json();
    if (gemData.error) throw new Error(gemData.error.message);
    return res.status(200).json({ text: gemData.candidates[0].content.parts[0].text });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}