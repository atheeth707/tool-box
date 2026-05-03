import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: any, res: any) {
  // 1. Ensure only POST requests are allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  const { prompt, mode } = req.body;

  // 2. Validation[cite: 1]
  if (!prompt) {
    return res.status(400).json({ text: "No prompt provided." });
  }

  try {
    // ROUTING LOGIC: Map 'mode' from frontend to the correct AI provider[cite: 1]
    
    // Default to Gemini for standard chat and code[cite: 1]
    if (mode === 'chat' || mode === 'code' || !mode) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      return res.status(200).json({ text: text, model: 'Gemini' });
    }

    // Use Groq for specific high-performance tasks if requested[cite: 1]
    if (mode === 'image' || mode === 'video') {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [{ role: "user", content: `Generate a detailed description for this ${mode} request: ${prompt}` }]
        })
      });

      if (!response.ok) throw new Error(`Groq API returned ${response.status}`);
      
      const data = await response.json();
      return res.status(200).json({ 
        text: data.choices[0].message.content, 
        model: 'Groq' 
      });
    }

    // Fallback if mode is unknown[cite: 1]
    return res.status(200).json({ text: "Mode not recognized, but here is a default echo: " + prompt });

  } catch (err: any) {
    console.error("Agent Error:", err);
    return res.status(500).json({ 
      text: "The AI agent failed to route your request. Check your API keys.",
      error: err.message 
    });
  }
}