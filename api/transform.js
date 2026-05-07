import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64, userId, masterPrompt } = req.body;

  try {
    // 1. Check Profile
    const { data: profile, error: pError } = await supabase.from('profiles').select('credits').eq('id', userId).single();
    if (pError || !profile) return res.status(404).json({ error: "Profile not found." });
    if (profile.credits < 1) return res.status(402).json({ error: "No credits left." });

    // 2. Call Stability
    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image",
      {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "application/json"
        },
        body: JSON.stringify({
          init_image: imageBase64,
          image_strength: 0.35,
          text_prompts: [{ text: masterPrompt, weight: 1 }],
          cfg_scale: 7,
          samples: 1,
          steps: 20, // REDUCED steps to 20 to avoid Vercel timeouts
        }),
      }
    );

    const resultData = await response.json();

    if (!response.ok) {
      // If Stability returns an error, we return it to the UI and DON'T deduct credits
      return res.status(response.status).json({ error: resultData.message || "Stability Rejected Request" });
    }

    // 3. Deduction happens ONLY if Stability sent back an image successfully
    const base64Output = resultData.artifacts[0].base64;
    
    const { data: updated } = await supabase
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', userId)
      .select('credits')
      .single();

    return res.status(200).json({ 
      output: `data:image/png;base64,${base64Output}`, 
      newCredits: updated.credits 
    });

  } catch (err) {
    console.error("CRITICAL ERROR:", err);
    return res.status(500).json({ error: "Connection lost between Vercel and Stability." });
  }
}