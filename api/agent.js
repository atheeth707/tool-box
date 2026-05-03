export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  const { prompt, mode } = req.body;

  if (!prompt) {
    return res.status(400).json({ text: "No prompt provided." });
  }

  try {
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    // Use Gemini 1.5 Flash on the v1 stable endpoint
    if (mode === 'chat' || mode === 'code' || !mode) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        }
      );

      const data = await response.json();

      // Better error handling for API responses
      if (data.error) {
        return res.status(data.error.code || 500).json({ 
          text: `Google API Error: ${data.error.message}` 
        });
      }

      // Safeguard against empty candidates
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "The AI returned an empty response.";
      return res.status(200).json({ text: aiText });
    }

    // Call Groq for other modes
    if (mode === 'image' || mode === 'video') {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await response.json();
      return res.status(200).json({ text: data.choices[0].message.content });
    }

  } catch (err) {
    console.error("Critical Backend Error:", err);
    return res.status(500).json({ text: "System Error: " + err.message });
  }
}