import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64, userId, masterPrompt } = req.body;

  // 1. KEY ROTATOR LOGIC
  // Collect all keys into an array
  const keys = [
    process.env.GEMINI_KEY_1,
    process.env.GEMINI_KEY_2,
    process.env.GEMINI_KEY_3,
    process.env.GEMINI_KEY_4,
    process.env.GEMINI_KEY_5,
    process.env.GEMINI_KEY_6,
    process.env.GEMINI_KEY_7,
    process.env.GEMINI_KEY_8,
    process.env.GEMINI_KEY_9,
    process.env.GEMINI_KEY_10
    
  ].filter(key => key); // Only use keys that actually exist

  // Pick a random key from your list
  const selectedKey = keys[Math.floor(Math.random() * keys.length)];

  try {
    // 2. Credit Check
    const { data: profile } = await supabase.from('profiles').select('credits').eq('id', userId).single();
    if (!profile || profile.credits < 1) return res.status(402).json({ error: "Out of credits." });

    // 3. API Request using the Rotated Key
    const MODEL_ID = "gemini-2.5-flash-image"; 
    const GOOGLE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${selectedKey}`;

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

    // 4. Handle Quota Error (If this key fails, let the user know to try again)
    if (!response.ok) {
      console.error("Key Error:", resultData.error?.message);
      if (response.status === 429) {
        return res.status(429).json({ error: "Key busy. Try clicking again instantly!" });
      }
      return res.status(response.status).json({ error: "Neural Engine busy." });
    }

    // 5. Success Logic
    const imagePart = resultData.candidates?.[0]?.content?.parts?.find(p => p.inline_data);
    if (!imagePart) return res.status(500).json({ error: "AI failed to return image." });

    const finalImage = `data:image/png;base64,${imagePart.inline_data.data}`;

    // Deduct Credit
    const { data: updated } = await supabase.from('profiles').update({ credits: profile.credits - 1 }).eq('id', userId).select('credits').single();

    return res.status(200).json({ output: finalImage, newCredits: updated?.credits });

  } catch (err) {
    return res.status(500).json({ error: "Connection lost." });
  }
}