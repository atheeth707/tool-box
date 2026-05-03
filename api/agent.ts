import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: any, res: any) {
  const { prompt, complexity } = req.body;

  try {
    // ROUTING LOGIC: If complexity is low, use Google (Gemini) due to high limits
    if (complexity === 'standard') {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      return res.status(200).json({ text: result.response.text(), model: 'Gemini' });
    }

    // If complexity is high, call GROQ (Example)
    if (complexity === 'high') {
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
      return res.status(200).json({ text: data.choices[0].message.content, model: 'Groq' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Agent failed to route request' });
  }
}