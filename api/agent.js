export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ text: "Method Not Allowed" });

  const { prompt } = req.body;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const GROQ_KEY = process.env.GROQ_API_KEY;

  // Debugging: Check keys without exposing them
  console.log(`Runtime Check - Gemini: ${!!GEMINI_KEY}, Groq: ${!!GROQ_KEY}`);

  if (!GEMINI_KEY && !GROQ_KEY) {
    return res.status(500).json({ text: "Backend Error: API Keys are missing in Vercel." });
  }

  try {
    // Attempt 1: Gemini 1.5 Flash (v1beta)
    try {
      const gResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const gData = await gResp.json();
      if (gData.candidates?.[0]?.content?.parts?.[0]?.text) {
        return res.status(200).json({ text: gData.candidates[0].content.parts[0].text });
      }
    } catch (e) { console.error("Gemini Engine Failure:", e.message); }

    // Attempt 2: Groq Llama 3 (Backup)
    try {
      const qResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
      const qData = await qResp.json();
      if (qData.choices?.[0]?.message?.content) {
        return res.status(200).json({ text: qData.choices[0].message.content });
      }
    } catch (e) { console.error("Groq Engine Failure:", e.message); }

    throw new Error("No providers responded with valid data.");

  } catch (err) {
    return res.status(500).json({ text: `AI Cluster Offline: ${err.message}` });
  }
}