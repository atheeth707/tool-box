import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64, userId, masterPrompt } = req.body;

  try {
    // 1. Check Profile & Credits
    const { data: profile, error: pError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (pError || !profile) return res.status(404).json({ error: "Profile not found." });
    if (profile.credits < 1) return res.status(402).json({ error: "Out of credits." });

    // 2. Call Google Gemini / Imagen 
    // We use the 'imagen-3.0-generate-001' or 'imagen-3.0-fast-generate-001'
    const GOOGLE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-fast-generate-001:predict?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(GOOGLE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [
          {
            prompt: masterPrompt,
            image: {
              bytesBase64Encoded: imageBase64
            }
          }
        ],
        parameters: {
          sampleCount: 1,
        }
      })
    });

    const resultData = await response.json();

    // 3. Handle Google's specific "Busy/Limit" errors
    if (!response.ok) {
      console.error("Google Studio Error:", resultData);
      
      // If the error is a 429 (Too many requests) or 503 (Busy)
      if (response.status === 429 || response.status === 503) {
        return res.status(503).json({ 
          error: "Google servers are currently busy. Please wait 30 seconds and try again." 
        });
      }
      
      return res.status(response.status).json({ 
        error: resultData.error?.message || "AI Engine currently offline." 
      });
    }

    // 4. Process Success
    const generatedImage = resultData.predictions[0].bytesBase64Encoded;
    const finalImage = `data:image/png;base64,${generatedImage}`;

    // 5. Deduct Credit ONLY if image was actually generated
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
    console.error("Critical Google Backend Error:", err);
    return res.status(500).json({ error: "Neural Engine Offline." });
  }
}