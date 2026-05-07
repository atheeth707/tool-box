const userCooldowns = new Map();

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

    // Reset daily count automatically
    const today = new Date().toDateString();

    if (dailyUsage.date !== today) {

      dailyUsage.date = today;
      dailyUsage.count = 0;

    }

    // Daily limit protection
    if (dailyUsage.count >= 480) {

      return res.status(429).json({
        reply:
          'AI is currently busy. Please try again later.'
      });

    }

    const ip =
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress ||
      'unknown';

    const now = Date.now();

    const lastRequest = userCooldowns.get(ip);

    // Cooldown protection
    if (lastRequest && now - lastRequest < 4000) {

      return res.status(429).json({
        reply:
          'Please wait a few seconds before sending another message.'
      });

    }

    userCooldowns.set(ip, now);

    // Auto cleanup old IPs
    setTimeout(() => {
      userCooldowns.delete(ip);
    }, 10000);

    const { message } = req.body;

    // Prevent empty spam
    if (!message || !message.trim()) {

      return res.status(400).json({
        reply: 'Please type a message.'
      });

    }

    // Prevent huge prompts
    if (message.length > 2000) {

      return res.status(400).json({
        reply:
          'Message is too long. Please shorten it.'
      });

    }

    dailyUsage.count++;

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
You are a smart modern AI assistant.

Behave naturally like ChatGPT.

Rules:
- Be conversational
- Be intelligent
- Be friendly
- Give useful replies
- Use markdown formatting
- Never mention Gemini
- Never mention Google AI
- Never mention APIs
- Sound natural

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