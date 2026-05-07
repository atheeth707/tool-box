import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  const { imageBase64, userId, masterPrompt } = req.body;

  // 1. IMPROVED CREDIT CHECK
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    return res.status(404).json({ error: "Profile not found. Please log in again." });
  }

  // Check if credits are enough (e.g., at least 1)
  if (Number(profile.credits) < 1) {
    return res.status(402).json({ error: "Out of credits! Please top up." });
  }

  try {
    // 2. STABILITY AI CALL
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
            { text: "blurry, low quality, distorted", weight: -1 }
          ],
          cfg_scale: 7,
          samples: 1,
          steps: 30,
        }),
      }
    );

    const resultData = await response.json();
    
    if (!response.ok) {
       return res.status(response.status).json({ error: resultData.message || "AI Engine Error" });
    }

    const outputImage = `data:image/png;base64,${resultData.artifacts[0].base64}`;

    // 3. DEDUCT CREDIT ONLY AFTER SUCCESS
    const { data: updatedProfile } = await supabase
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', userId)
      .select()
      .single();

    return res.status(200).json({ 
      output: outputImage, 
      newCredits: updatedProfile.credits 
    });

  } catch (err) {
    return res.status(500).json({ error: "API Connection Error" });
  }
}