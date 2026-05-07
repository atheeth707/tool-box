import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64, userId, masterPrompt } = req.body;

  try {
    // 1. Database Credit Check
    const { data: profile } = await supabase.from('profiles').select('credits').eq('id', userId).single();
    if (!profile || profile.credits < 1) return res.status(402).json({ error: "Out of credits." });

    // 2. Try Gemini 3.1 Flash Image (Better Quota usually)
    // If this fails, we can fallback to 2.5
    const MODEL_ID = "gemini-3.1-flash-image"; 
    const GOOGLE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(GOOGLE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: masterPrompt },
            { inline_data: { mime_type: "image/png", data: imageBase64 } }
          ]
        }],
        generationConfig: { response_modalities: ["IMAGE"] }
      })
    });

    const resultData = await response.json();

    // 3. Handle Quota Error specifically
    if (!response.ok) {
      if (resultData.error?.message?.includes("quota") || response.status === 429) {
        return res.status(429).json({ 
          error: "Nexus Free Tier is full. Try again in 60 seconds." 
        });
      }
      return res.status(response.status).json({ error: "AI Engine busy. Try again." });
    }

    // 4. Success - Extract Image
    const imagePart = resultData.candidates?.[0]?.content?.parts?.find(p => p.inline_data);
    if (!imagePart) return res.status(500).json({ error: "AI did not return an image." });

    const finalImage = `data:image/png;base64,${imagePart.inline_data.data}`;

    // 5. Update Database
    const { data: updated } = await supabase.from('profiles').update({ credits: profile.credits - 1 }).eq('id', userId).select('credits').single();

    return res.status(200).json({ output: finalImage, newCredits: updated?.credits });

  } catch (err) {
    return res.status(500).json({ error: "Connection error." });
  }
}