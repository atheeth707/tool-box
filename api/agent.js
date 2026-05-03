const { Buffer } = require('buffer');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ text: "Method Not Allowed" });

  const { prompt, mode = 'chat', textToSpeak } = req.body;
  
  // These must be set in your Vercel/Environment variables
  const keys = {
    gemini: process.env.GEMINI_API_KEY, // Get at aistudio.google.com
    groq: process.env.GROQ_API_KEY,     // Get at console.groq.com
    hf: process.env.HF_TOKEN,           // Get at huggingface.co/settings/tokens
  };

  // ADVANCED WAKE-UP LOGIC: Retries if the model is "Loading"
  async function fetchWithRetry(url, options, retries = 5) {
    for (let i = 0; i < retries; i++) {
      const response = await fetch(url, options);
      // 503 means the AI is still "waking up"
      if (response.status !== 503) return response;
      console.log(`AI is waking up... attempt ${i + 1}`);
      await new Promise(resolve => setTimeout(resolve, 4000)); 
    }
    return fetch(url, options);
  }

  // --- 1. TEXT TO SPEECH (Real AI Voice) ---
  if (textToSpeak) {
    try {
      const ttsResp = await fetchWithRetry("https://api-inference.huggingface.co/models/microsoft/speecht5_tts", {
        headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: textToSpeak.substring(0, 500) }),
      });
      const buffer = await ttsResp.arrayBuffer();
      return res.status(200).json({ data: `data:audio/mpeg;base64,${Buffer.from(buffer).toString('base64')}`, type: 'audio' });
    } catch (e) { return res.status(500).json({ text: "Voice engine error." }); }
  }

  try {
    // --- 2. IMAGE GENERATION (Real Flux AI) ---
    if (mode === 'image') {
      const imgResp = await fetchWithRetry("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell", {
        headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      });
      if (!imgResp.ok) throw new Error("Image server is still waking up. Try once more.");
      const buffer = await imgResp.arrayBuffer();
      return res.status(200).json({ data: `data:image/webp;base64,${Buffer.from(buffer).toString('base64')}`, type: 'image' });
    }

    // --- 3. VIDEO GENERATION (Real Wan 2.1 AI) ---
    if (mode === 'video') {
      const vidResp = await fetchWithRetry("https://api-inference.huggingface.co/models/Wan-AI/Wan2.1-T2V-14B", {
        headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      });
      const vidData = await vidResp.json();
      return res.status(200).json({ data: vidData.output || vidData[0], type: 'video' });
    }

    // --- 4. EXPERT CODE (Real Llama 3.3 70B via Groq) ---
    if (mode === 'code') {
      const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${keys.groq}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }] })
      });
      const groqData = await groqResp.json();
      return res.status(200).json({ text: groqData.choices[0].message.content });
    } 

    // --- 5. CHAT (Real Gemini 1.5 Flash) ---
    const gemResp = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${keys.gemini}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const gemData = await gemResp.json();
    return res.status(200).json({ text: gemData.candidates[0].content.parts[0].text });

  } catch (err) {
    return res.status(500).json({ text: `System busy: ${err.message}` });
  }
}