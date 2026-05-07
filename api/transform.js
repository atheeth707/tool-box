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

    // 2. Nano Banana (Gemini 2.5 Flash Image) API Call
    // Model ID: gemini-2.5-flash-image
    const MODEL_ID = "gemini-2.5-flash-image";
    const GOOGLE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(GOOGLE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: masterPrompt },
            {
              inline_data: {
                mime_type: "image/png",
                data: imageBase64 // This is the user's uploaded image
              }
            }
          ]
        }],
        generationConfig: {
          // Tell the model we want an IMAGE back, not just text
          response_modalities: ["IMAGE"] 
        }
      })
    });

    const resultData = await response.json();

    if (!response.ok) {
      console.error("Nano Banana Error:", resultData);
      return res.status(response.status).json({ 
        error: resultData.error?.message || "Nano Banana Engine is currently busy." 
      });
    }

    // 3. Extract the image from the multimodal response
    // Nano Banana returns the image inside the candidates array
    const imagePart = resultData.candidates?.[0]?.content?.parts?.find(p => p.inline_data);
    
    if (!imagePart) {
      return res.status(500).json({ error: "AI processed the request but didn't return an image." });
    }

    const finalImage = `data:image/png;base64,${imagePart.inline_data.data}`;

    // 4. Deduct Credit
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
    console.error("Critical Nano Banana Error:", err);
    return res.status(500).json({ error: "Neural Engine Offline." });
  }
}