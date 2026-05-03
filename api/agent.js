export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ text: "Method Not Allowed" });

  const { prompt } = req.body;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const GROQ_KEY = process.env.GROQ_API_KEY;

  // Crucial for debugging in Vercel Dashboard
  console.log(`System Check - Gemini: ${!!GEMINI_KEY}, Groq: ${!!GROQ_KEY}`);

  if (!GEMINI_KEY && !GROQ_KEY) {
    return res.status(500).json({ text: "Backend Error: API Keys are missing in Vercel environment variables." });
  }

  // Helper to try Gemini
  async function tryGemini() {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    throw new Error(data.error?.message || "Gemini invalid response");
  }

  // Helper to try Groq
  async function tryGroq() {
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
    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    }
    throw new Error(data.error?.message || "Groq invalid response");
  }

  try {
    // Attempt Gemini first
    try {
      const text = await tryGemini();
      return res.status(200).json({ text });
    } catch (geminiErr) {
      console.error("Gemini attempt failed:", geminiErr.message);
      // Fallback to Groq
      const text = await tryGroq();
      return res.status(200).json({ text });
    }
  } catch (finalErr) {
    return res.status(500).json({ 
      text: "AI Cluster Offline. All engines exhausted.", 
      details: finalErr.message 
    });
  }
}