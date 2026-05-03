export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ text: "Method Not Allowed" });

  const { prompt, mode = 'chat' } = req.body;
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    groq: process.env.GROQ_API_KEY,
    hf: process.env.HF_TOKEN,
  };

  // --- ENGINE: Hugging Face (Image Generation) ---
  async function callHuggingFaceImage(p) {
    if (!keys.hf) throw new Error("HF_TOKEN missing.");
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: p }),
      }
    );
    if (!response.ok) throw new Error("Hugging Face Image Gen Failed");
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
    if (!resp.ok) throw new Error("Groq failed");
    const data = await resp.json();
    return { text: data.choices[0].message.content, engine: "Llama 3.1" };
  }

  // --- ENGINE: Gemini (Fallback & Logic) ---
  async function callGemini(p) {
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${keys.gemini}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: p }] }] })
    });
    if (!resp.ok) throw new Error("Gemini failed");
    const data = await resp.json();
    return { text: data.candidates[0].content.parts[0].text, engine: "Gemini 1.5 Flash" };
  }

  try {
    if (mode === 'image') return res.status(200).json(await callHuggingFaceImage(prompt));

    const finalPrompt = mode === 'video' 
      ? `Provide a cinematic visual description for a 5-second video: ${prompt}` 
      : mode === 'code' ? `Write expert code for: ${prompt}` : prompt;

    // Failover Logic: Try Groq -> Fallback Gemini
    try {
      if (keys.groq) return res.status(200).json(await callGroq(finalPrompt));
    } catch (e) {
      console.warn("Groq failed, switching to Gemini.");
    }
    
    return res.status(200).json(await callGemini(finalPrompt));

  } catch (err) {
    return res.status(500).json({ text: `System Error: ${err.message}`, type: 'text' });
  }
}