import { Buffer } from 'buffer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

  const { prompt, mode = 'chat' } = req.body;
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    hf: process.env.HF_TOKEN,
  };

  // Helper to call HF with wait_for_model and retry logic
  async function callHF(modelId, input) {
    const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
      headers: { 
        Authorization: `Bearer ${keys.hf}`, 
        "Content-Type": "application/json" 
      },
      method: "POST",
      body: JSON.stringify({ 
        inputs: input,
        options: { wait_for_model: true } // Prevents 404/503 during cold starts
      }),
    });
    return response;
  }

  try {
    // --- IMAGE: Fallback System[cite: 14] ---
    if (mode === 'image') {
      let imgResp = await callHF("runwayml/stable-diffusion-v1-5", prompt);
      
      // Fallback if the first model is 404 or down
      if (!imgResp.ok) {
        imgResp = await callHF("stabilityai/stable-diffusion-2-1", prompt);
      }
      
      if (!imgResp.ok) throw new Error(`HF Image Error: ${imgResp.status}`);
      const buffer = await imgResp.arrayBuffer();
      return res.status(200).json({ 
        data: `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`, 
        type: 'image' 
      });
    }

    // --- VIDEO: Fallback System[cite: 14] ---
    if (mode === 'video') {
      let vidResp = await callHF("damo-vilab/modelscope-damo-text-to-video", prompt);
      
      // Fallback for video
      if (!vidResp.ok) {
        vidResp = await callHF("ali-vilab/text-to-video-ms-1.5", prompt);
      }

      if (!vidResp.ok) throw new Error(`HF Video Error: ${vidResp.status}`);
      const buffer = await vidResp.arrayBuffer();
      return res.status(200).json({ 
        data: `data:video/mp4;base64,${Buffer.from(buffer).toString('base64')}`, 
        type: 'video' 
      });
    }

    // --- CHAT: (Gemini 2.5 Flash - Left untouched) ---
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