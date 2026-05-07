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

    // 2. Updated Google Gemini Image API Call
    // Using the 3.1 Flash Image model name (Nano Banana 2)
    const MODEL_NAME = "gemini-3.1-flash-image"; 
    const GOOGLE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${process.env.GEMINI_API_KEY}`;

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
                data: imageBase64 // The source image for Image-to-Image
              }
            }
          ]
        }],
        generationConfig: {
          sampleCount: 1,
          candidateCount: 1
        }
      })
    });

    const resultData = await response.json();

    if (!response.ok) {
      console.error("Google API Error:", resultData);
      return res.status(response.status).json({ 
        error: "Engine compatibility error. Check model name in AI Studio." 
      });
    }

    // 3. Extract the Generated Image
    // Gemini 3.1 Flash Image returns the file in the candidates[0].content.parts
    const generatedPart = resultData.candidates[0].content.parts.find(p => p.inline_data);
    
    if (!generatedPart) {
       return res.status(500).json({ error: "AI failed to return an image." });
    }

    const finalImage = `data:image/png;base64,${generatedPart.inline_data.data}`;

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
    console.error("Critical Backend Error:", err);
    return res.status(500).json({ error: "Neural Engine Offline." });
  }
}