import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { imageBase64, userId, styleType } = req.body;

  // 1. Credit Check
  const { data: profile } = await supabase.from('profiles').select('credits').eq('id', userId).single();
  if (!profile || profile.credits < 1) return res.status(402).json({ error: "Out of credits" });

  try {
    // 2. Hidden Prompt Logic - This is the "Secret Sauce"
    const masterPrompt = `Act as a professional creative director. 
    Analyze this image and transform it into a high-end ${styleType} masterpiece. 
    Maintain the core subject and layout, but enhance the lighting, texture, and artistic quality to look like a premium 8k digital artwork. 
    Provide a vivid, detailed description of the transformed scene.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: masterPrompt },
            { inline_data: { mime_type: "image/jpeg", data: imageBase64 } }
          ]
        }]
      })
    });

    const data = await response.json();
    const outputText = data.candidates[0].content.parts[0].text;

    // 3. Deduct Credit
    await supabase.from('profiles').update({ credits: profile.credits - 1 }).eq('id', userId);

    return res.status(200).json({ 
      output: outputText,
      newCredits: profile.credits - 1 
    });

  } catch (err) {
    return res.status(500).json({ error: "Transformation failed. No credits taken." });
  }
}