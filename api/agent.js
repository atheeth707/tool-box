export default async function handler(req, res) {
  // 1. Setup CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();

  // 2. Environment Variable Validation
  const keys = {
    gemini: process.env.GEMINI_API_KEY,
    hf: process.env.HF_TOKEN,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  };

  // 3. Handle GET (For your Supabase Config check)
  if (req.method === 'GET') {
    return res.status(200).json({
      url: keys.supabaseUrl,
      key: keys.supabaseKey,
      status: keys.gemini ? "AI_ACTIVE" : "AI_MISSING_KEYS"
    });
  }

  // 4. Handle POST (For AI Requests)
  if (req.method === 'POST') {
    const { prompt, mode } = req.body;

    if (!keys.gemini) return res.status(500).json({ error: "GEMINI_API_KEY is not set in Vercel." });

    try {
      const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keys.gemini}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await aiRes.json();
      return res.status(200).json({ 
        text: data.candidates[0].content.parts[0].text,
        type: 'text'
      });
    } catch (err) {
      return res.status(500).json({ error: "Internal AI Link Error" });
    }
  }
}