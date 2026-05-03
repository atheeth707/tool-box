export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ text: "Method Not Allowed" });

  const { prompt } = req.body;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const GROQ_KEY = process.env.GROQ_API_KEY;

  if (!GEMINI_KEY && !GROQ_KEY) {
    return res.status(500).json({ text: "Error: API Keys are missing in Vercel." });
  }

  let geminiError = "Key not configured";
  let groqError = "Key not configured";

  // Attempt 1: Gemini 1.5 Flash (Switched to v1 stable endpoint)
  if (GEMINI_KEY) {
    try {
      const gResp = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const gData = await gResp.json();

      if (gResp.ok && gData.candidates?.[0]?.content?.parts?.[0]?.text) {
        return res.status(200).json({ text: gData.candidates[0].content.parts[0].text });
      } else {
        geminiError = gData.error?.message || "Invalid response structure";
      }
    } catch (e) {
      geminiError = "Fetch failed - " + e.message;
    }
  }

  // Attempt 2: Groq Backup (Switched to Llama 3.1 8b Instant)
  if (GROQ_KEY) {
    try {
      const qResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${GROQ_KEY}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          model: "llama-3.1-8b-instant", 
          messages: [{ role: "user", content: prompt }] 
        })
      });
      const qData = await qResp.json();

      if (qResp.ok && qData.choices?.[0]?.message?.content) {
        return res.status(200).json({ text: qData.choices[0].message.content });
      } else {
        groqError = qData.error?.message || "Invalid response structure";
      }
    } catch (e) {
      groqError = "Fetch failed - " + e.message;
    }
  }

  return res.status(500).json({ 
    text: `AI Offline.\n\nGemini Error: ${geminiError}\n\nGroq Error: ${groqError}` 
  });
}