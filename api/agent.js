import { Buffer } from 'buffer';

export const config = {
  api: { responseLimit: '10mb' }, // Prevents payload errors for media
};

export default async function handler(req, res) {
  // Ensure we ALWAYS start with a JSON header
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt, mode = 'chat' } = req.body;
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    hf: process.env.HF_TOKEN,
  };

  try {
    // --- Helper: Reliable HF Fetcher ---
    async function callHF(modelId, input) {
      const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
        headers: { 
          Authorization: `Bearer ${keys.hf}`, 
          "Content-Type": "application/json" 
        },
        method: "POST",
        body: JSON.stringify({ inputs: input, options: { wait_for_model: true } }),
      });
      return response;
    }

    if (mode === 'image') {
      const imgResp = await callHF("stabilityai/stable-diffusion-xl-base-1.0", prompt);
      if (!imgResp.ok) throw new Error("Image engine is warming up.");
      
      const buffer = await imgResp.arrayBuffer();
      if (!buffer || buffer.byteLength === 0) throw new Error("Received empty image data.");
      
      return res.status(200).json({ 
        data: `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`, 
        type: 'image' 
      });
    }

    if (mode === 'video') {
      const vidResp = await callHF("ali-vilab/text-to-video-ms-1.7b", prompt);
      if (!vidResp.ok) throw new Error("Video engine is currently busy.");
      
      const buffer = await vidResp.arrayBuffer();
      if (!buffer || buffer.byteLength === 0) throw new Error("Received empty video data.");

      return res.status(200).json({ 
        data: `data:video/mp4;base64,${Buffer.from(buffer).toString('base64')}`, 
        type: 'video' 
      });
    }

    // --- Gemini Chat (The core reliable engine) ---
    const gemUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${keys.gemini}`;
    const gemResp = await fetch(gemUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const gemData = await gemResp.json();
    if (gemData.error) throw new Error(gemData.error.message);
    
    return res.status(200).json({ 
      text: gemData.candidates[0].content.parts[0].text,
      type: 'text'
    });

  } catch (err) {
    console.error("Backend Error:", err.message);
    // Force a JSON response even on failure
    return res.status(500).json({ 
      error: err.message || "An unexpected system error occurred.",
      type: 'error'
    });
  }
}