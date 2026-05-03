export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  const { prompt, mode } = req.body;
  if (!prompt) return res.status(400).json({ text: "Prompt required." });

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const GROQ_KEY = process.env.GROQ_API_KEY;

  // --- HELPER: Attempt Gemini (Multi-Version Support) ---
  async function tryGemini(version, modelName) {
    const url = `https://generativelanguage.googleapis.com/${version}/models/${modelName}:generateContent?key=${GEMINI_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    
    if (!response.ok) throw new Error(`Gemini ${version} failed`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
  }

  // --- HELPER: Attempt Groq (Llama 3) ---
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
    
    if (!response.ok) throw new Error("Groq failed");
    const data = await response.json();
    return data.choices[0].message.content;
  }

  // --- EXECUTION LOGIC: The Failover Chain ---
  try {
    let resultText = null;

    // 1. Try Gemini v1beta (Highest compatibility)
    try {
      console.log("Attempting Gemini v1beta...");
      resultText = await tryGemini('v1beta', 'gemini-1.5-flash');
    } catch (e) {
      // 2. Try Gemini v1 (Stable) if v1beta fails
      try {
        console.log("v1beta failed, attempting Gemini v1...");
        resultText = await tryGemini('v1', 'gemini-1.5-flash-latest');
      } catch (e2) {
        // 3. Ultimate Fallback: Groq
        console.log("All Gemini versions failed, falling back to Groq...");
        resultText = await tryGroq();
      }
    }

    if (!resultText) throw new Error("All AI engines failed to respond.");

    return res.status(200).json({ text: resultText });

  } catch (err) {
    console.error("Failover Chain Error:", err);
    return res.status(500).json({ text: "Fatal Error: " + err.message });
  }
}