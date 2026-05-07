import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageBase64, userId, masterPrompt } = req.body;

  if (!imageBase64 || !userId || !masterPrompt) {
    return res.status(400).json({ error: "Missing required generation data." });
  }

  try {
    // 1. Check Profile & Credits
    const { data: profile, error: pError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (pError || !profile) {
      return res.status(404).json({ error: "Profile not found. Please log in again." });
    }

    if (profile.credits < 1) {
      return res.status(402).json({ error: "Insufficient credits." });
    }

    // 2. CONSTRUCT MULTIPART/FORM-DATA
    // This is required by Stability AI for image-to-image transfers
    const buffer = Buffer.from(imageBase64, 'base64');
    const formData = new FormData();
    
    // We append the buffer as a Blob so the Fetch API knows it's a file
    formData.append('init_image', new Blob([buffer], { type: 'image/png' }));
    formData.append('init_image_mode', 'IMAGE_STRENGTH');
    formData.append('image_strength', '0.35');
    
    // Stability expects text_prompts as specific indexed keys in multipart mode
    formData.append('text_prompts[0][text]', masterPrompt);
    formData.append('text_prompts[0][weight]', '1');
    formData.append('text_prompts[1][text]', 'blurry, low quality, distorted, bad anatomy');
    formData.append('text_prompts[1][weight]', '-1');
    
    formData.append('cfg_scale', '7');
    formData.append('samples', '1');
    formData.append('steps', '25');

    // 3. CALL STABILITY AI
    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image",
      {
        method: "POST",
        headers: {
          // IMPORTANT: Do NOT set 'Content-Type'. 
          // The browser/server will automatically add it with the correct boundary.
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "application/json",
        },
        body: formData,
      }
    );

    const resultData = await response.json();

    if (!response.ok) {
      console.error("Stability Error:", resultData);
      return res.status(response.status).json({ 
        error: resultData.message || "AI Engine rejection." 
      });
    }

    // 4. PROCESS SUCCESS
    const base64Output = resultData.artifacts[0].base64;
    const finalImage = `data:image/png;base64,${base64Output}`;

    // 5. DEDUCT CREDIT
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
    console.error("Critical Engine Error:", err);
    return res.status(500).json({ error: "Neural Engine Connection Failed." });
  }
}