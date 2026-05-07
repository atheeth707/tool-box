const userCooldowns = new Map();

export default async function handler(req, res) {

  try {

    if (req.method !== 'POST') {
      return res.status(405).json({
        reply: 'Method not allowed'
      });
    }

    const ip =
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress ||
      'unknown';

    const now = Date.now();

    const cooldown = userCooldowns.get(ip);

    // 3 second cooldown
    if (cooldown && now - cooldown < 3000) {

      return res.status(429).json({
        reply:
          'Please wait a few seconds before sending another message.'
      });

    }

    userCooldowns.set(ip, now);

    const { message } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({

          contents: [
            {
              role: 'user',

              parts: [
                {
                  text: `
You are a modern AI assistant.

Behave naturally like ChatGPT.

Rules:
- Be conversational
- Be helpful
- Be smart
- Give detailed replies
- Use markdown formatting when useful
- Never mention Gemini
- Never mention Google AI
- Never mention you are an API
- Talk naturally like a real assistant

User:
${message}
`
                }
              ]
            }
          ],

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
        reply: data.error.message
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