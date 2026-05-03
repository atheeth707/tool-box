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
        // 503 means model is loading, 429 means too many requests
        if (response.status !== 503 && response.status !== 429) return response;
        
        // Wait longer for video models (10s) vs others (5s)
        const waitTime = url.includes("video") ? 10000 : 5000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } catch (e) {
        if (i === retries - 1) throw e;
      }
    }
    return fetch(url, options);
  }

  try {
    // --- IMAGE: Stable Diffusion 2.1 (Very stable, no 404) ---
    if (mode === 'image') {
      const imgResp = await fetchWithRetry(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
        {
          headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ inputs: prompt }),
        }
      );
      if (!imgResp.ok) throw new Error(`HF Image Error: ${imgResp.status}`);
      const buffer = await imgResp.arrayBuffer();
      return res.status(200).json({ data: `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`, type: 'image' });
    }

    // --- VIDEO: ModelScope (Most reliable free inference endpoint) ---
    if (mode === 'video') {
      const vidResp = await fetchWithRetry(
        "https://api-inference.huggingface.co/models/damo-vilab/modelscope-damo-text-to-video",
        {
          headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ inputs: prompt }),
        }
      );
      if (!vidResp.ok) throw new Error(`HF Video Error: ${vidResp.status}`);
      const buffer = await vidResp.arrayBuffer();
      return res.status(200).json({ data: `data:video/mp4;base64,${Buffer.from(buffer).toString('base64')}`, type: 'video' });
    }

    // --- CHAT: (UNTOUCHED) ---
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