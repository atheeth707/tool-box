import { Buffer } from 'buffer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

  const { prompt, mode = 'chat', textToSpeak } = req.body;
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    hf: process.env.HF_TOKEN,
  };

  async function fetchWithRetry(url, options, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.status !== 503) return response;
        await new Promise(resolve => setTimeout(resolve, 4000));
      } catch (e) {
        if (i === retries - 1) throw e;
      }
    }
    return fetch(url, options);
  }

  try {
    // --- 1. TTS (Hugging Face) ---
    if (textToSpeak) {
      const ttsResp = await fetchWithRetry("https://api-inference.huggingface.co/models/microsoft/speecht5_tts", {
        headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: textToSpeak.substring(0, 500) }),
      });
      if (!ttsResp.ok) throw new Error(`TTS Error: ${ttsResp.status}`);
      const buffer = await ttsResp.arrayBuffer();
      return res.status(200).json({ data: `data:audio/mpeg;base64,${Buffer.from(buffer).toString('base64')}`, type: 'audio' });
    }

    // --- 2. Image (Hugging Face - Stable Diffusion XL via Router) ---
    if (mode === 'image') {
      const imgResp = await fetchWithRetry("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
        headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      });
      if (!imgResp.ok) throw new Error(`Image API Error: ${imgResp.status}. Verify HF_TOKEN is a 'Read' or 'Write' token.`);
      const buffer = await imgResp.arrayBuffer();
      return res.status(200).json({ data: `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`, type: 'image' });
    }

    // --- 3. Video (Hugging Face - AnimateDiff) ---
    if (mode === 'video') {
      const vidResp = await fetchWithRetry("https://api-inference.huggingface.co/models/guoyww/AnimateDiff", {
        headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      });
      if (!vidResp.ok) throw new Error(`Video API Error: ${vidResp.status}. Model may be loading.`);
      const buffer = await vidResp.arrayBuffer();
      return res.status(200).json({ data: `data:video/mp4;base64,${Buffer.from(buffer).toString('base64')}`, type: 'video' });
    }

    // --- 4. Chat (Google Gemini 2.5 Flash - NEWEST) ---
    // gemini-1.5 is retired; using the stable 2.5 release
    const gemUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${keys.gemini}`;
    const gemResp = await fetch(gemUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    
    const gemData = await gemResp.json();
    if (gemData.error) throw new Error(`Gemini Error: ${gemData.error.message}`);
    return res.status(200).json({ text: gemData.candidates[0].content.parts[0].text });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}