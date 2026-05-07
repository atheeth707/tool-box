import { createClient } from "@supabase/supabase-js";

export default async function handler(req: any, res: any) {
  try {
    const { userId, prompt, style } = req.body;

    if (!userId || !prompt || !style) {
      return res.status(400).json({ error: "Missing data" });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. GET USER CREDITS
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();

    if (!profile || profile.credits <= 0) {
      return res.status(403).json({ error: "No credits" });
    }

    // 2. STYLE PROMPTS (hidden)
    const STYLE_MAP: any = {
      cinematic:
        "cinematic lighting, ultra realistic, film grain, 85mm lens, dramatic shadows",
      anime:
        "anime style, clean line art, vibrant colors, highly detailed illustration",
      luxury:
        "luxury product photography, studio lighting, premium advertisement style",
      poster:
        "movie poster, cinematic composition, dramatic lighting, ultra detailed",
      thumbnail:
        "viral youtube thumbnail, high contrast, expressive face, bold composition",
      wallpaper:
        "minimal aesthetic wallpaper, soft gradients, ultra clean modern design"
    };

    const finalPrompt = `${STYLE_MAP[style] || ""}, ${prompt}`;

    // 3. CALL STABILITY AI
    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          output_format: "png"
        })
      }
    );

    const data = await response.json();

    if (!data.image) {
      return res.status(500).json({ error: "Image generation failed" });
    }

    // 4. DEDUCT CREDIT (SAFE SERVER SIDE)
    await supabase
      .from("profiles")
      .update({ credits: profile.credits - 1 })
      .eq("id", userId);

    // 5. RETURN IMAGE
    return res.status(200).json({
      image: data.image
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}const userCooldowns = new Map();

const dailyUsage = {
  date: new Date().toDateString(),
  count: 0
};

export default async function handler(req, res) {

  try {

    if (req.method !== 'POST') {

      return res.status(405).json({
        reply: 'Method not allowed.'
      });

    }

    const today = new Date().toDateString();

    if (dailyUsage.date !== today) {

      dailyUsage.date = today;
      dailyUsage.count = 0;

    }

    if (dailyUsage.count >= 480) {

      return res.status(429).json({
        reply:
          'AI is busy right now. Please try again later.'
      });

    }

    const ip =
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress ||
      'unknown';

    const now = Date.now();

    const lastRequest = userCooldowns.get(ip);

    if (lastRequest && now - lastRequest < 4000) {

      return res.status(429).json({
        reply:
          'Please wait a few seconds before sending another message.'
      });

    }

    userCooldowns.set(ip, now);

    setTimeout(() => {
      userCooldowns.delete(ip);
    }, 10000);

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {

      return res.status(400).json({
        reply: 'Invalid messages.'
      });

    }

    dailyUsage.count++;

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `
You are a smart modern AI assistant.

Rules:
- Behave naturally
- Continue conversations naturally
- Remember previous chat messages in this conversation
- Never say you forgot context
- Never say you cannot remember
- Be conversational like ChatGPT
- Never mention Gemini or Google AI
`
          }
        ]
      },

      ...messages.map((msg) => ({
        role: msg.role === 'assistant'
          ? 'model'
          : 'user',

        parts: [
          {
            text: msg.text
          }
        ]
      }))
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({

          contents,

          generationConfig: {
            temperature: 0.9,
            topP: 1,
            topK: 1,
            maxOutputTokens: 1024
          }

        })
      }
    );

    const data = await response.json();

    console.log(data);

    if (data.error) {

      return res.status(500).json({
        reply:
          data.error.message ||
          'AI request failed.'
      });

    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({
      reply:
        reply ||
        'Please try again.'
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      reply: 'Server error.'
    });

  }

}