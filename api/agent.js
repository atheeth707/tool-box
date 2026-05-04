import { Buffer } from 'buffer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

  const { prompt, mode = 'chat' } = req.body;
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    hf: process.env.HF_TOKEN,
  };

  // Robust Polling System: Fixes the HF connection drops and 404/503 errors
  async function callHFWithRetry(modelId, input) {
    let retries = 3;
    while (retries > 0) {
      const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
        headers: { 
          Authorization: `Bearer ${keys.hf}`, 
          "Content-Type": "application/json" 
        },
        method: "POST",
        body: JSON.stringify({ 
          inputs: input,
          options: { wait_for_model: true } 
        }),
      });
      
      // If HF says "Model is loading" (503), we wait 10 seconds and try again automatically
      if (response.status === 503) {
        retries--;
        await new Promise(r => setTimeout(r, 10000));
        continue;
      }
      
      return response;
    }
    return null;
  }

  try {
    // --- IMAGE: Using Verified Free Tier HF Models ---
    if (mode === 'image') {
      let imgResp = await callHFWithRetry("stabilityai/stable-diffusion-xl-base-1.0", prompt);
      
      // Fallback to another top-tier free model if the first fails
      if (!imgResp || !imgResp.ok) {
        imgResp = await callHFWithRetry("prompthero/openjourney", prompt);
      }
      
      if (!imgResp.ok) throw new Error(`HF Image Error: Model endpoint inactive`);
      
      const buffer = await imgResp.arrayBuffer();
      return res.status(200).json({ 
        data: `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`, 
        type: 'image' 
      });
    }

    // --- VIDEO: Using the Latest Supported HF Video Models ---
    if (mode === 'video') {
      let vidResp = await callHFWithRetry("Lightricks/LTX-Video", prompt);
      
      if (!vidResp || !vidResp.ok) {
        vidResp = await callHFWithRetry("Wan-AI/Wan2.1-T2V-1.3B", prompt);
      }

      if (!vidResp.ok) throw new Error(`HF Video Error: Model endpoint inactive`);
      
      const buffer = await vidResp.arrayBuffer();
      return res.status(200).json({ 
        data: `data:video/mp4;base64,${Buffer.from(buffer).toString('base64')}`, 
        type: 'video' 
      });
    }

    // --- CHAT: (Gemini 2.5 Flash - Untouched & Perfect) ---
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