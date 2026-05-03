export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ text: "Method Not Allowed" });

  const { prompt, mode = 'chat' } = req.body;
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    groq: process.env.GROQ_API_KEY,
    hf: process.env.HF_TOKEN, // Hugging Face Token
  };

  // --- ENGINE: Hugging Face (Images) ---
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
    return { data: `data:image/webp;base64,${base64}`, type: 'image', engine: "HF (FLUX.1)" };
  }

  // --- ENGINE: Groq (Chat/Code Primary) ---
  async function callGroq(p) {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${keys.groq}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ role: "user", content: p }] })
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error("Groq failed");
    return { text: data.choices[0].message.content, engine: "Groq (Llama 3.1)" };
  }

  // --- ENGINE: Gemini (Fallback & Video Logic) ---
  async function callGemini(p) {
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${keys.gemini}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: p }] }] })
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error("Gemini failed");
    return { text: data.candidates[0].content.parts[0].text, engine: "Gemini 1.5 Flash" };
  }

  try {
    // 1. IMAGE MODE
    if (mode === 'image') {
      return res.status(200).json(await callHuggingFaceImage(prompt));
    }

    // 2. VIDEO MODE (Descriptive Scripting via Gemini)
    if (mode === 'video') {
      const videoPrompt = `Act as a cinematic director. Provide a highly detailed, frame-by-frame visual description for a 5-second video based on: ${prompt}. Use vivid lighting and motion cues.`;
      return res.status(200).json(await callGemini(videoPrompt));
    }

    // 3. CHAT/CODE MODE (Groq First -> Gemini Fallback)
    const finalPrompt = mode === 'code' ? `Write expert, clean code for: ${prompt}` : prompt;
    
    if (keys.groq) {
      try {
        const result = await callGroq(finalPrompt);
        return res.status(200).json(result);
      } catch (e) {
        console.error("Groq down, failing over to Gemini...");
      }
    }
    
    return res.status(200).json(await callGemini(finalPrompt));

  } catch (err) {
    return res.status(500).json({ text: `System Error: ${err.message}`, type: 'text' });
  }
}