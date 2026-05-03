export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ text: "Method Not Allowed" });

  const { prompt, mode = 'chat' } = req.body;
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    groq: process.env.GROQ_API_KEY,
    hf: process.env.HF_TOKEN,
  };

  // --- IMAGE ENGINE: Hugging Face (FLUX.1-schnell) ---
  async function callHuggingFaceImage(p) {
    if (!keys.hf) throw new Error("HF_TOKEN missing.");
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

    if (response.status === 503) throw new Error("Model is loading. Please try again in 30 seconds.");
    if (!response.ok) throw new Error("Image generation failed. check HF Token.");

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return { data: `data:image/webp;base64,${base64}`, type: 'image', engine: "FLUX.1 (HF)" };
  }

  // --- CHAT ENGINE: Groq (Llama 3.1 8B - Lowest Cost) ---
  async function callGroq(p) {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${keys.groq}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        model: "llama-3.1-8b-instant", // The $0.05/1M token model
        messages: [{ role: "user", content: p }],
        temperature: 0.7
      })
    });
    if (!resp.ok) throw new Error("Groq API error.");
    const data = await resp.json();
    return { text: data.choices[0].message.content, engine: "Llama 3.1 8B (Groq)" };
  }

  // --- FALLBACK ENGINE: Gemini 1.5 Flash ---
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

    const finalPrompt = mode === 'video' 
      ? `Create a cinematic, frame-by-frame visual storyboard for a 5-second video: ${prompt}` 
      : mode === 'code' ? `Write professional, production-ready code for: ${prompt}` : prompt;

    // Try Groq first (Lowest cost)
    try {
      if (keys.groq) return res.status(200).json(await callGroq(finalPrompt));
    } catch (e) {
      console.warn("Groq failed, switching to Gemini.");
    }
    
    // Fallback to Gemini
    return res.status(200).json(await callGemini(finalPrompt));

  } catch (err) {
    return res.status(500).json({ text: err.message, type: 'text' });
  }
}