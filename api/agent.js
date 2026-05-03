import { Buffer } from 'buffer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

  const { prompt, mode = 'chat', textToSpeak } = req.body;
  
  // Only two keys needed now
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    hf: process.env.HF_TOKEN,
  };

  // Validation for your 2 keys
  if (textToSpeak || mode === 'image' || mode === 'video') {
    if (!keys.hf) return res.status(400).json({ error: "HuggingFace token (HF_TOKEN) missing in .env" });
  }
  if (mode === 'chat' && !keys.gemini) return res.status(400).json({ error: "Google Gemini key (GEMINI_API_KEY) missing in .env" });

  async function fetchWithRetry(url, options, retries = 5) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.status !== 503) return response; // 503 = Model Loading
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s for free models to wake up
      } catch (e) {
        if (i === retries - 1) throw e;
      }
    }
    return fetch(url, options);
  }

  try {
    // --- TTS (Hugging Face) ---
    if (textToSpeak) {
      const ttsResp = await fetchWithRetry("https://api-inference.huggingface.co/models/microsoft/speecht5_tts", {
        headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: textToSpeak.substring(0, 500) }),
      });
      if (!ttsResp.ok) throw new Error(`HF TTS Error: ${await ttsResp.text()}`);
      const buffer = await ttsResp.arrayBuffer();
      return res.status(200).json({ data: `data:audio/mpeg;base64,${Buffer.from(buffer).toString('base64')}`, type: 'audio' });
    }

    // --- Image (Hugging Face - SDXL) ---
    if (mode === 'image') {
      const imgResp = await fetchWithRetry("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
        headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      });
      if (!imgResp.ok) throw new Error(`Image API Error: ${await imgResp.text()}`);
      const buffer = await imgResp.arrayBuffer();
      return res.status(200).json({ data: `data:image/webp;base64,${Buffer.from(buffer).toString('base64')}`, type: 'image' });
    }

    // --- Video (Hugging Face - AnimateDiff) ---
    if (mode === 'video') {
      const vidResp = await fetchWithRetry("https://api-inference.huggingface.co/models/guoyww/AnimateDiff", {
        headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      });
      if (!vidResp.ok) throw new Error(`Video API Error: ${await vidResp.text()}`);
      const buffer = await vidResp.arrayBuffer();
      return res.status(200).json({ data: `data:video/mp4;base64,${Buffer.from(buffer).toString('base64')}`, type: 'video' });
    }

    // --- Chat (Google Gemini 1.5 Flash) ---
    const gemResp = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${keys.gemini}`, {
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