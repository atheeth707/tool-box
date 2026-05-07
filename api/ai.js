export default async function handler(req, res) {

  try {

    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Method not allowed'
      });
    }

    const { message } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
                  text: message
                }
              ]
            }
          ],

          generationConfig: {
            temperature: 0.9,
            topP: 1,
            topK: 1,
            maxOutputTokens: 2048
          }
        })
      }
    );

    const data = await response.json();

    console.log(JSON.stringify(data));

    if (data.error) {

      return res.status(500).json({
        reply: data.error.message
      });

    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({
      reply:
        reply ||
        'No response generated.'
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      reply: 'Server error.'
    });

  }

}