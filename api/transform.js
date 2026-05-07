import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { imageBase64, userId, masterPrompt } = req.body;

  // 1. Credit Check
  const { data: profile } = await supabase.from('profiles').select('credits').eq('id', userId).single();
  if (!profile || profile.credits < 1) return res.status(402).json({ error: "Out of credits" });

  try {
    // 2. Call Stability AI (Image-to-Image)
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
          image_strength: 0.35, // Balance between original photo and AI style
          text_prompts: [
            { text: masterPrompt, weight: 1 },
            { text: "blurry, distorted, low quality, bad anatomy", weight: -1 }
          ],
          cfg_scale: 7,
          samples: 1,
          steps: 30,
        }),
      }
    );

    const data = await response.json();
    
    // Stability returns an array of images in base64
    const outputImage = `data:image/png;base64,${data.artifacts[0].base64}`;

    // 3. Deduct Credit
    await supabase.from('profiles').update({ credits: profile.credits - 1 }).eq('id', userId);

    return res.status(200).json({ 
      output: outputImage, // This now returns a new IMAGE instead of just text
      newCredits: profile.credits - 1 
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Stability Engine Error" });
  }
}