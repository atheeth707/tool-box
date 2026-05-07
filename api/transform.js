import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64, userId, masterPrompt } = req.body;

  try {
    // 1. Validate User & Credits
    const { data: profile, error: pError } = await supabase.from('profiles').select('credits').eq('id', userId).single();
    if (pError || !profile) return res.status(404).json({ error: "Profile not found." });
    if (profile.credits < 1) return res.status(402).json({ error: "Out of credits." });

    // 2. Prepare for Stability AI
    // We expect imageBase64 to be a clean string (no data:image/png prefix)
    const buffer = Buffer.from(imageBase64, 'base64');
    
    const formData = new FormData();
    formData.append('init_image', new Blob([buffer], { type: 'image/png' }));
    formData.append('init_image_mode', 'IMAGE_STRENGTH');
    formData.append('image_strength', '0.35');
    formData.append('text_prompts[0][text]', masterPrompt);
    formData.append('text_prompts[0][weight]', '1');
    formData.append('cfg_scale', '7');
    formData.append('samples', '1');
    formData.append('steps', '30');

    // 3. Request Transformation
    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image",
      {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "application/json"
        },
        body: formData,
      }
    );

    const resultData = await response.json();
    
    if (!response.ok) {
      console.error("Stability API Error:", resultData);
      return res.status(response.status).json({ error: resultData.message || "AI Engine busy." });
    }

    // 4. Handle Success
    const base64Output = resultData.artifacts[0].base64;
    const finalImage = `data:image/png;base64,${base64Output}`;

    // Deduct Credit
    const { data: updated } = await supabase
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', userId)
      .select('credits')
      .single();

    return res.status(200).json({ output: finalImage, newCredits: updated.credits });

  } catch (err) {
    console.error("Critical Backend Error:", err);
    return res.status(500).json({ error: "Neural Engine Offline." });
  }
}