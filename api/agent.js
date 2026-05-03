// --- Mandatory imports for TTS handling ---
const { Buffer } = require('buffer');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ text: "Method Not Allowed" });

  const { prompt, mode = 'chat', textToSpeak } = req.body;
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    groq: process.env.GROQ_API_KEY,
    hf: process.env.HF_TOKEN,
  };

  if (!keys.hf || !keys.groq || !keys.gemini) {
    return res.status(500).json({ text: "Error: API Keys are missing in Vercel settings." });
  }

  // --- ENGINE 1: Hugging Face TTS (SpeechT5) ---
  if (textToSpeak) {
    try {
      const ttsResp = await fetch(
        "https://api-inference.huggingface.co/models/microsoft/speecht5_tts",
        {
          headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ inputs: textToSpeak }),
        }
      );
      if (!ttsResp.ok) throw new Error("TTS API failed.");
      const buffer = await ttsResp.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      // Return TTS data immediately
      return res.status(200).json({ data: `data:audio/mpeg;base64,${base64}`, type: 'audio', engine: "SpeechT5 (HF)" });
    } catch (e) { return res.status(500).json({ text: `TTS Error: ${e.message}` }); }
  }

  // --- ENGINE 2: Groq (Llama 3.3 70B - Expert Coding) ---
  async function callGroqCoding(p) {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${keys.groq}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        model: "llama-3.3-70b-versatile", // Expert high-accuracy model
        messages: [{ role: "user", content: p }],
        temperature: 0.3 // Lower temperature for more accurate code
      })
    });
    if (!resp.ok) throw new Error("Groq Coding Engine failed.");
    const data = await resp.json();
    return { text: data.choices[0].message.content, engine: "Llama 3.3 70B (Groq)" };
  }

  // --- ENGINE 3: Gemini (Chat & Video Scene Logic) ---
  async function callGemini(p) {
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${keys.gemini}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: p }] }] })
    });
    if (!resp.ok) throw new Error("Gemini low-cost model failed.");
    const data = await resp.json();
    return { text: data.candidates[0].content.parts[0].text, engine: "Gemini 1.5 Flash" };
  }

  // --- ENGINE 4: Hugging Face Video (Wan 2.2 via T2V-5B) ---
  async function callHFVideo(p) {
    const resp = await fetch(
      "https://api-inference.huggingface.co/models/Wan-AI/Wan2.2-TI2V-5B",
      {
        headers: { Authorization: `Bearer ${keys.hf}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: p }),
      }
    );
    // Many HF video models return a processing URL or require multiple polling steps
    if (!resp.ok) throw new Error("Hugging Face Video API failed.");
    const data = await resp.json();
    if (data.error) throw new Error(data.error);
    // Usually returns a processed asset URL or Base64 in data.output
    return { data: data.output || data.processing_url, type: 'video', engine: "Wan 2.2 (HF)" };
  }

  try {
    // IMAGE generation disabled as per request (not in required engine list).
    if (mode === 'image') return res.status(200).json({ text: "Image generation disabled. Use Chat/Code/Video modes.", type: 'text' });

    // 1. VIDEO MODE (Using Wan 2.2 via Gemini scripting fallback)
    if (mode === 'video') {
      try {
        // Try direct video generation first
        return res.status(200).json(await callHFVideo(prompt));
      } catch (videoError) {
        // Fallback: Generate cinematic scene script via Gemini
        console.warn("Video Gen failed, falling back to scene script.");
        const scriptPrompt = `Act as a cinematic director. Write a highly technical visual script for a 5-second video scene based on: ${prompt}`;
        const script = await callGemini(scriptPrompt);
        return res.status(200).json({ text: `Video Gen failed (${videoError.message}). Here is a scene script: ${script.text}`, type: 'text', engine: "Gemini 1.5 Fallback" });
      }
    }

    // 2. CODE MODE (Groq Llama 3.3 70B - Expert Coding)
    if (mode === 'code') {
      return res.status(200).json(await callGroqCoding(`Write expert code with comments: ${prompt}`));
    }

    // 3. CHAT MODE (Gemini 1.5 Flash - Low Cost)
    return res.status(200).json(await callGemini(prompt));

  } catch (err) {
    return res.status(500).json({ text: `AI Cluster offline: ${err.message}`, type: 'text' });
  }
}