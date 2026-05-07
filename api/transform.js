import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with Service Role Key if possible for backend updates, 
// otherwise standard keys work with correct RLS policies.
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageBase64, userId, masterPrompt } = req.body;

  // Check if all required data is present
  if (!imageBase64 || !userId || !masterPrompt) {
    return res.status(400).json({ error: "Missing required generation data." });
  }

  try {
    // 1. SAFE PROFILE & CREDIT CHECK
    const { data: profile, error: pError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    // Fix for the 'null reading credits' error:
    if (pError || !profile) {
      console.error("Database Error:", pError);
      return res.status(404).json({ 
        error: "User profile not initialized. Please refresh the app or log in again." 
      });
    }

    if (profile.credits < 1) {
      return res.status(402).json({ error: "Insufficient credits in your account." });
    }

    // 2. PREPARE STABILITY AI REQUEST
    // Note: imageBase64 should be a clean string without the "data:image..." prefix
    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          init_image: imageBase64,
          image_strength: 0.35,
          text_prompts: [
            { text: masterPrompt, weight: 1 },
            { text: "blurry, low quality, distorted, bad anatomy", weight: -1 }
          ],
          cfg_scale: 7,
          samples: 1,
          steps: 25, // Optimized to stay under Vercel's 10s timeout
        }),
      }
    );

    const resultData = await response.json();

    if (!response.ok) {
      console.error("Stability Engine Error:", resultData);
      return res.status(response.status).json({ 
        error: resultData.message || "The AI engine is currently busy. Try again." 
      });
    }

    // 3. PROCESS SUCCESSFUL GENERATION
    const base64Output = resultData.artifacts[0].base64;
    const finalImage = `data:image/png;base64,${base64Output}`;

    // 4. DEDUCT CREDITS ONLY ON SUCCESS
    const { data: updated, error: uError } = await supabase
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', userId)
      .select('credits')
      .single();

    if (uError) {
      console.error("Credit Deduction Failed:", uError);
      // We still return the image even if deduction failed so the user isn't frustrated
    }

    return res.status(200).json({
      output: finalImage,
      newCredits: updated ? updated.credits : profile.credits - 1
    });

  } catch (err) {
    console.error("Critical Backend Error:", err);
    return res.status(500).json({ error: "Neural Engine Offline. Please check server logs." });
  }
}