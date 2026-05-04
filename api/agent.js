import { Buffer } from 'buffer';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') return res.status(405).json({ error: "Invalid Method" });

  const { prompt, mode = 'chat' } = req.body;
  const HF_TOKEN = process.env.HF_TOKEN;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  async function fetchWithRetry(url, body, retries = 3) {
    for (let i = 0; i < retries; i++) {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(body),
      });

      if (response.ok) return response;
      
      // If 503 (Loading), wait 10 seconds and try again
      if (response.status === 503 && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        continue;
      }
      return response;
    }
  }

  try {
    if (mode === 'image') {
      // Using FLUX.1-schnell: Fast and high quality
      const response = await fetchWithRetry(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        { inputs: prompt }
      );
      
      if (!response.ok) throw new Error("Image engine is warming up. Try again in 10 seconds.");
      
      const buffer = await response.arrayBuffer();
      return res.status(200).json({ 
        data: `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`, 
        type: 'image' 
      });
    }

    if (mode === 'video') {
      const response = await fetchWithRetry(
        "https://api-inference.huggingface.co/models/ali-vilab/text-to-video-ms-1.7b",
        { inputs: prompt }
      );
      
      if (!response.ok) throw new Error("Video engine is currently busy. Try a shorter prompt.");
      
      const buffer = await response.arrayBuffer();
      return res.status(200).json({ 
        data: `data:video/mp4;base64,${Buffer.from(buffer).toString('base64')}`, 
        type: 'video' 
      });
    }

    // Default Chat: Gemini 2.0 Flash
    const gemRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const gemData = await gemRes.json();
    if (gemData.error) throw new Error(gemData.error.message);

    return res.status(200).json({ 
      text: gemData.candidates[0].content.parts[0].text,
      type: 'text'
    });

  } catch (err) {
    // Return the specific error as a valid JSON object
    return res.status(200).json({ error: err.message, type: 'text' });
  }
}