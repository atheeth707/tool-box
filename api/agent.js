export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  const { prompt, mode } = req.body;

  if (!prompt) {
    return res.status(400).json({ text: "No prompt provided." });
  }

  try {
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    
    // Use native fetch to call Gemini directly (No install needed)[cite: 1]
    if (mode === 'chat' || mode === 'code' || !mode) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();
      
      // Handle Google API errors[cite: 1]
      if (data.error) {
        throw new Error(data.error.message || "Gemini API Error");
      }

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response content.";
      return res.status(200).json({ text: aiText });
    }

    // Call Groq using native fetch[cite: 2]
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
    console.error("Backend Error:", err);
    // Return JSON to prevent frontend SyntaxError[cite: 1]
    return res.status(500).json({ text: "System Error: " + err.message });
  }
}