import { Buffer } from 'buffer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

  const { prompt, mode = 'chat' } = req.body;
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    hf: process.env.HF_TOKEN,
  };

  // Improved Fetch with Auto-Retry for "Model Loading" (503) and 404 Fallbacks
  async function hfFetch(modelId, inputPrompt) {
    const url = `https://api-inference.huggingface.co/models/${modelId}`;
    for (let i = 0; i < 3; i++) {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: inputPrompt }),
      });
      
      if (response.ok) return response;
      if (response.status === 503) { // Model is loading
        await new Promise(r => setTimeout(r, 8000));
        continue;
      }
      return response; // Return error response to trigger fallback
    }
  }

  try {
    // --- IMAGE GENERATION (With Fallback) ---
    if (mode === 'image') {
      let imgResp = await hfFetch("stabilityai/stable-diffusion-xl-base-1.0", prompt);
      
      if (!imgResp.ok) { // Fallback to v1.5 if XL is 404 or down
        imgResp = await hfFetch("runwayml/stable-diffusion-v1-5", prompt);
      }
      
      if (!imgResp.ok) throw new Error(`HF Image Error: ${imgResp.status}`);
      const buffer = await imgResp.arrayBuffer();
      return res.status(200).json({ data: `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`, type: 'image' });
    }

    // --- VIDEO GENERATION (High Availability Model) ---
    if (mode === 'video') {
      const vidResp = await hfFetch("ali-vilab/text-to-video-ms-1.5", prompt);
      if (!vidResp.ok) throw new Error(`HF Video Error: ${vidResp.status}`);
      
      const buffer = await vidResp.arrayBuffer();
      return res.status(200).json({ data: `data:video/mp4;base64,${Buffer.from(buffer).toString('base64')}`, type: 'video' });
    }

    // --- CHAT (Untouched as requested - Gemini 2.5 Flash) ---
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