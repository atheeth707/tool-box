export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({
      reply: 'Method not allowed'
    });
  }

  try {

    const { message } = req.body;

    const lower = message.toLowerCase();

    let toolMessage = '';

    if (
      lower.includes('image to pdf') ||
      lower.includes('jpg to pdf') ||
      lower.includes('png to pdf')
    ) {
      toolMessage = `
Recommended Tool:
https://tool-box-free.vercel.app/tool/image-to-pdf
`;
    }

    else if (
      lower.includes('background remover') ||
      lower.includes('remove background') ||
      lower.includes('bg remover')
    ) {
      toolMessage = `
Recommended Tool:
https://tool-box-free.vercel.app/tool/background-remover
`;
    }

    else if (
      lower.includes('compress image')
    ) {
      toolMessage = `
Recommended Tool:
https://tool-box-free.vercel.app/tool/image-compressor
`;
    }

    else if (
      lower.includes('qr code') ||
      lower.includes('qr')
    ) {
      toolMessage = `
Recommended Tool:
https://tool-box-free.vercel.app/tool/qr-generator
`;
    }

    const prompt = `
You are Toolbox AI.

Act like a modern AI assistant similar to ChatGPT and Gemini.

Rules:
- Be intelligent
- Be conversational
- Give useful answers
- Never say "I cannot understand"
- Reply clearly
- If user asks tool related things, suggest tools
- Keep formatting clean
- Sound natural

Website:
https://tool-box-free.vercel.app

${toolMessage}

User message:
${message}
`;

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
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800
          }
        })
      }
    );

    const data = await response.json();

    console.log(data);

    let reply = '';

    if (
      data &&
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.length > 0
    ) {
      reply = data.candidates[0].content.parts[0].text;
    } else {
      reply = 'Hey! I am Toolbox AI. Ask me anything.';
    }

    return res.status(200).json({
      reply
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      reply: 'AI server error.'
    });

  }
}