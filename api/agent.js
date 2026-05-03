export default async function handler(req, res) {
  // 1. Safety Guard for methods
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ text: "Prompt is required." });

  // 2. Fetch keys directly from process.env
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const GROQ_KEY = process.env.GROQ_API_KEY;

  // --- AI PROVIDER 1: Gemini v1beta ---
  const tryGeminiBeta = async () => {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );
    const data = await resp.json();
    if (!resp.ok || data.error) throw new Error("Beta Failed");
    return data.candidates[0].content.parts[0].text;
  };

  // --- AI PROVIDER 2: Gemini v1 (Stable) ---
  const tryGeminiStable = async () => {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );
    const data = await resp.json();
    if (!resp.ok || data.error) throw new Error("Stable Failed");
    return data.candidates[0].content.parts[0].text;
  };

  // --- AI PROVIDER 3: Groq (Llama 3) ---
  const tryGroq = async () => {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await resp.json();
    if (!resp.ok || data.error) throw new Error("Groq Failed");
    return data.choices[0].message.content;
  };

  // --- EXECUTION CHAIN ---
  try {
    try {
      const result = await tryGeminiBeta();
      return res.status(200).json({ text: result });
    } catch (e1) {
      try {
        const result = await tryGeminiStable();
        return res.status(200).json({ text: result });
      } catch (e2) {
        const result = await tryGroq();
        return res.status(200).json({ text: result });
      }
    }
  } catch (finalError) {
    // If we reach here, all providers failed. 
    // We return a detailed error to help you debug in the browser console.
    return res.status(500).json({ 
      text: "AI Cluster Offline. Check Vercel Logs for API Key Status.",
      debug: { gemini: !!GEMINI_KEY, groq: !!GROQ_KEY }
    });
  }
}