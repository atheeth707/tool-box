export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ text: "Method Not Allowed" });

  const { prompt, mode = 'chat' } = req.body;
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    groq: process.env.GROQ_API_KEY,
    hf: process.env.HF_TOKEN,
  };

  // --- ENGINE: Hugging Face (Optimized for Images) ---
  async function callHuggingFaceImage(p) {
    if (!keys.hf) throw new Error("HF_TOKEN missing in environment.");
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: { 
          Authorization: `Bearer ${keys.hf}`, 
          "Content-Type": "application/json",
          "x-use-cache": "false" 
        },
        method: "POST",
        body: JSON.stringify({ inputs: p }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Hugging Face model is currently loading or busy.");
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return { data: `data:image/webp;base64,${base64}`, type: 'image', engine: "FLUX.1 (HF)" };
  }

  // --- ENGINE: Groq (Llama 3.1) ---
  async function callGroq(p) {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${keys.groq}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ role: "user", content: p }] })
    });
    if (!resp.ok) throw new Error("Groq API error.");
    const data = await resp.json();
    return { text: data.choices[0].message.content, engine: "Llama 3.1" };
  }

  // --- ENGINE: Gemini (Fix for Video/Fallback) ---
  async function callGemini(p) {
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${keys.gemini}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: p }] }] })
    });
    if (!resp.ok) throw new Error("Gemini API error.");
    const data = await resp.json();
    return { text: data.candidates[0].content.parts[0].text, engine: "Gemini 1.5 Flash" };
  }

  try {
    if (mode === 'image') return res.status(200).json(await callHuggingFaceImage(prompt));

    const systemPrompt = mode === 'video' 
      ? `Provide a cinematic, technical visual description for a video based on: ${prompt}` 
      : mode === 'code' ? `Write professional code for: ${prompt}` : prompt;

    // Groq First -> Gemini Fallback
    try {
      if (keys.groq) return res.status(200).json(await callGroq(systemPrompt));
    } catch (e) {
      console.warn("Groq failed, falling back to Gemini.");
    }
    
    return res.status(200).json(await callGemini(systemPrompt));

  } catch (err) {
    return res.status(500).json({ text: `System Error: ${err.message}`, type: 'text' });
  }
}