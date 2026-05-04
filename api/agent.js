import { Buffer } from 'buffer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

  const { prompt, mode = 'chat' } = req.body;
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    hf: process.env.HF_TOKEN,
  };

  // Robust Polling System that exposes the REAL error
  async function callHFWithRetry(modelId, input) {
    let retries = 4; // Will try up to 4 times (max ~60 seconds of waiting)
    let lastError = "Unknown Hugging Face Error";
    
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
      
      // If successful, return the raw response immediately
      if (response.ok) return response;
      
      // If it fails, read the actual error from HF
      const errData = await response.json().catch(() => ({}));
      lastError = errData.error || `HTTP Status ${response.status}`;

      // If HF says the model is currently loading (503), wait 15 seconds and try again
      if (response.status === 503 || lastError.toLowerCase().includes('loading')) {
        retries--;
        await new Promise(r => setTimeout(r, 15000));
        continue;
      }
      
      // If it's an authorization issue, stop retrying and tell the user immediately
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Token Error: Your HF_TOKEN is invalid or lacks 'Write' permissions. (${lastError})`);
      }

      // For any other error (like model gated), stop retrying
      break;
    }
    
    // Throw the EXACT error message from Hugging Face
    throw new Error(lastError);
  }

  try {
    // --- IMAGE: Using Dreamshaper (Highly stable free-tier model) ---
    if (mode === 'image') {
      try {
        const imgResp = await callHFWithRetry("Lykon/dreamshaper-8", prompt);
        const buffer = await imgResp.arrayBuffer();
        return res.status(200).json({ 
          data: `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`, 
          type: 'image' 
        });
      } catch (e) {
        throw new Error(`HF Image Error: ${e.message}`);
      }
    }

    // --- VIDEO: Using ModelScope 1.7b (Most reliable free-tier video model) ---
    if (mode === 'video') {
      try {
        const vidResp = await callHFWithRetry("ali-vilab/text-to-video-ms-1.7b", prompt);
        const buffer = await vidResp.arrayBuffer();
        return res.status(200).json({ 
          data: `data:video/mp4;base64,${Buffer.from(buffer).toString('base64')}`, 
          type: 'video' 
        });
      } catch (e) {
        throw new Error(`HF Video Error: ${e.message}`);
      }
    }

    // --- CHAT: (Gemini - Left untouched and perfect) ---
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