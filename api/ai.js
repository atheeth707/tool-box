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