export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  const { prompt, mode } = req.body;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const GROQ_KEY = process.env.GROQ_API_KEY;

  // AI 1: Gemini v1beta (Most flexible)
  const tryGeminiBeta = async () => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );
    const data = await response.json();
    if (!response.ok || data.error) throw new Error("Gemini Beta Failed");
    return data.candidates[0].content.parts[0].text;
  };

  // AI 2: Gemini v1 (Stable)
  const tryGeminiStable = async () => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );
    const data = await response.json();
    if (!response.ok || data.error) throw new Error("Gemini Stable Failed");
    return data.candidates[0].content.parts[0].text;
  };

  // AI 3: Groq (Llama 3 70B)
  const tryGroq = async () => {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
    const data = await response.json();
    if (!response.ok || data.error) throw new Error("Groq Failed");
    return data.choices[0].message.content;
  };

  // --- FAILOVER EXECUTION LOGIC ---
  try {
    try {
      console.log("Trying AI 1...");
      const result = await tryGeminiBeta();
      return res.status(200).json({ text: result, engine: "Gemini Beta" });
    } catch (e1) {
      try {
        console.log("AI 1 failed, Trying AI 2...");
        const result = await tryGeminiStable();
        return res.status(200).json({ text: result, engine: "Gemini Stable" });
      } catch (e2) {
        console.log("AI 2 failed, Trying AI 3 (Ultimate Fallback)...");
        const result = await tryGroq();
        return res.status(200).json({ text: result, engine: "Groq Llama" });
      }
    }
  } catch (finalError) {
    console.error("All AI engines exhausted.");
    return res.status(500).json({ 
      text: "All AI providers are currently unavailable. Please check your API keys in Vercel settings." 
    });
  }
}