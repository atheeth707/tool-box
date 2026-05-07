import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { imageBase64, userId, masterPrompt } = req.body;

  // 1. Credit & Profile Check
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', userId)
    .single();

  if (profileError || !profile) return res.status(404).json({ error: "Profile not found" });
  if (Number(profile.credits) < 1) return res.status(402).json({ error: "Out of credits" });

  try {
    // 2. Convert Base64 to Buffer for Multipart
    const buffer = Buffer.from(imageBase64, 'base64');

    // 3. Construct Multipart Data
    const formData = new FormData();
    formData.append('init_image', new Blob([buffer], { type: 'image/png' }));
    formData.append('init_image_mode', 'IMAGE_STRENGTH');
    formData.append('image_strength', '0.35');
    formData.append('text_prompts[0][text]', masterPrompt);
    formData.append('text_prompts[0][weight]', '1');
    formData.append('cfg_scale', '7');
    formData.append('samples', '1');
    formData.append('steps', '30');

    // 4. Call Stability AI
    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          // NOTE: Do not manually set Content-Type header when using FormData; 
          // the browser/node environment will set it with the correct 'boundary'.
        },
        body: formData,
      }
    );

    const resultData = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: resultData.message || "AI Engine Error" });
    }

    const outputBase64 = resultData.artifacts[0].base64;
    const outputImage = `data:image/png;base64,${outputBase64}`;

    // 5. Deduct Credit
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
    console.error(err);
    return res.status(500).json({ error: "Multipart Processing Error" });
  }
}