export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  const { prompt, mode } = req.body;

  if (!prompt) {
    return res.status(400).json({ text: "Prompt is required." });
  }

  try {
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    // Use the -latest suffix which is required for the v1 endpoint
    if (mode === 'chat' || mode === 'code' || !mode) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_KEY}`,
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

      // Catch API-specific errors from Google
      if (data.error) {
        return res.status(data.error.code || 500).json({ 
          text: `Google API Error: ${data.error.message}` 
        });
      }

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response content.";
      return res.status(200).json({ text: aiText });
    }

    // Groq logic for other modes
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
    console.error("Fetch Error:", err);
    return res.status(500).json({ text: "Internal Server Error: " + err.message });
  }
}