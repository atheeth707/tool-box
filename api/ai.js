export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    const { message } = req.body;

    const lower = message.toLowerCase();

    let toolSuggestion = '';

    if (
      lower.includes('image to pdf') ||
      lower.includes('jpg to pdf') ||
      lower.includes('png to pdf')
    ) {
      toolSuggestion = `
You can use our Image To PDF tool here:
https://tool-box-free.vercel.app/tool/image-to-pdf
`;
    }

    else if (
      lower.includes('remove background') ||
      lower.includes('background remover') ||
      lower.includes('bg remover')
    ) {
      toolSuggestion = `
You can use our Background Remover tool here:
https://tool-box-free.vercel.app/tool/background-remover
`;
    }

    else if (
      lower.includes('compress image') ||
      lower.includes('reduce image size')
    ) {
      toolSuggestion = `
You can use our Image Compressor tool here:
https://tool-box-free.vercel.app/tool/image-compressor
`;
    }

    else if (
      lower.includes('qr') ||
      lower.includes('qr code')
    ) {
      toolSuggestion = `
You can use our QR Generator tool here:
https://tool-box-free.vercel.app/tool/qr-generator
`;
    }

    else if (
      lower.includes('youtube thumbnail')
    ) {
      toolSuggestion = `
You can use our YouTube Thumbnail Downloader here:
https://tool-box-free.vercel.app/tool/youtube-thumbnail-downloader
`;
    }

    const prompt = `
You are Toolbox AI.

You are a modern AI assistant similar to ChatGPT and Gemini.

Behave like a real helpful AI assistant.

Rules:
- Always answer naturally
- Be friendly
- Give detailed helpful answers
- Never say "I could not understand"
- If user asks tool related questions, recommend website tools
- If user asks normal questions, answer normally
- Make responses modern and smart

Website:
https://tool-box-free.vercel.app

Tool suggestion:
${toolSuggestion}

User:
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
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Hello! How can I help you today?';

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