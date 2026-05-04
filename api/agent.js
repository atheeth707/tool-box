import { Buffer } from 'buffer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

  const { prompt, mode = 'chat' } = req.body;
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    hf: process.env.HF_TOKEN,
  };

  // Helper to handle the Hugging Face lifecycle (fixes 404/503 issues)
  async function callHF(modelId, input) {
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
    return response;
  }

  try {
    // --- IMAGE: Using SD-XL Base (Highest Reliability) ---
    if (mode === 'image') {
      let imgResp = await callHF("stabilityai/stable-diffusion-xl-base-1.0", prompt);
      
      // Secondary fallback if XL is busy
      if (!imgResp.ok) {
        imgResp = await callHF("runwayml/stable-diffusion-v1-5", prompt);
      }
      
      if (!imgResp.ok) throw new Error(`Image Service Unavailable`);
      const buffer = await imgResp.arrayBuffer();
      return res.status(200).json({ 
        data: `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`, 
        type: 'image' 
      });
    }

    // --- VIDEO: Using the verified ModelScope engine ---
    if (mode === 'video') {
      const vidResp = await callHF("ali-vilab/text-to-video-ms-1.7b", prompt);
      
      if (!vidResp.ok) throw new Error(`Video Service Unavailable`);
      const buffer = await vidResp.arrayBuffer();
      return res.status(200).json({ 
        data: `data:video/mp4;base64,${Buffer.from(buffer).toString('base64')}`, 
        type: 'video' 
      });
    }

    // --- CHAT: Gemini 2.5 Flash (Untouched) ---
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
    // Hide technical details from user, return clean error
    return res.status(500).json({ error: "The engine is currently calibrating. Please try again in a moment." });
  }
}