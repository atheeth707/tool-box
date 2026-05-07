import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64, userId, masterPrompt } = req.body;

  try {
    // 1. Credit Check
    const { data: profile, error: pError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (pError || !profile) return res.status(404).json({ error: "Profile not found." });
    if (profile.credits < 1) return res.status(402).json({ error: "Out of credits." });

    // 2. CALL GOOGLE GEMINI (IMAGEN)
    // We use the Imagen 3 / Fast Generate endpoint provided via your Google API Key
    const GOOGLE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3-fast-generate:predict?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(GOOGLE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [
          {
            prompt: masterPrompt,
            image: {
              bytesBase64Encoded: imageBase64 // Google handles the base64 bytes directly
            }
          }
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: "1:1",
          outputMimeType: "image/png"
        }
      })
    });

    const resultData = await response.json();

    if (!response.ok) {
      console.error("Google AI Error:", resultData);
      return res.status(response.status).json({ error: "Google AI Engine busy or limit reached." });
    }

    // 3. EXTRACT IMAGE
    // Google returns the image in the predictions array as a base64 string
    const generatedImageBase64 = resultData.predictions[0].bytesBase64Encoded;
    const finalImage = `data:image/png;base64,${generatedImageBase64}`;

    // 4. DEDUCT CREDIT
    const { data: updated } = await supabase
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', userId)
      .select('credits')
      .single();

    return res.status(200).json({
      output: finalImage,
      newCredits: updated ? updated.credits : profile.credits - 1
    });

  } catch (err) {
    console.error("Critical Google AI Error:", err);
    return res.status(500).json({ error: "Google Neural Engine Offline." });
  }
}