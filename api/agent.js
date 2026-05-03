export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ text: "Method Not Allowed" });

  const { prompt } = req.body;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const GROQ_KEY = process.env.GROQ_API_KEY;

  // Log key presence to Vercel Logs (will not show the actual key)
  console.log(`Key Status - Gemini: ${!!GEMINI_KEY}, Groq: ${!!GROQ_KEY}`);

  if (!GEMINI_KEY && !GROQ_KEY) {
    return res.status(500).json({ text: "API Keys missing in Vercel Environment." });
  }

  try {
    // 1. Try Gemini (v1beta is usually more permissive)
    try {
      const gResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const gData = await gResp.json();
      if (gData.candidates) return res.status(200).json({ text: gData.candidates[0].content.parts[0].text });
    } catch (e) { console.error("Gemini failed"); }

    // 2. Try Groq (The Backup)
    try {
      const qResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: "llama3-70b-8192", messages: [{ role: "user", content: prompt }] })
      });
      const qData = await qResp.json();
      if (qData.choices) return res.status(200).json({ text: qData.choices[0].message.content });
    } catch (e) { console.error("Groq failed"); }

    throw new Error("All AI engines exhausted.");
  } catch (err) {
    return res.status(500).json({ text: "AI Cluster Offline: " + err.message });
  }
}