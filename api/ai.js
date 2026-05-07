export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    const { message } = req.body;

    const prompt = `
You are ToolBox AI Assistant.

You help users find the correct online tool.

Reply short, friendly, and SEO friendly.

User request:
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

    const aiReply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'I could not understand that request.';

    const lower = message.toLowerCase();

    let tool = null;

    if (
      lower.includes('image to pdf') ||
      lower.includes('jpg to pdf') ||
      lower.includes('png to pdf')
    ) {
      tool = {
        title: 'Image To PDF Converter',
        url: '/tool/image-to-pdf',
        description:
          'Convert JPG PNG and images into PDF online free.'
      };
    }

    else if (
      lower.includes('remove background') ||
      lower.includes('background remover') ||
      lower.includes('bg remover')
    ) {
      tool = {
        title: 'Background Remover',
        url: '/tool/background-remover',
        description:
          'Remove image backgrounds instantly online free.'
      };
    }

    else if (
      lower.includes('compress image') ||
      lower.includes('reduce image size')
    ) {
      tool = {
        title: 'Image Compressor',
        url: '/tool/image-compressor',
        description:
          'Compress images and reduce image size online.'
      };
    }

    else if (
      lower.includes('qr') ||
      lower.includes('qr code')
    ) {
      tool = {
        title: 'QR Code Generator',
        url: '/tool/qr-generator',
        description:
          'Generate QR codes online for free.'
      };
    }

    else if (
      lower.includes('youtube thumbnail')
    ) {
      tool = {
        title: 'YouTube Thumbnail Downloader',
        url: '/tool/youtube-thumbnail-downloader',
        description:
          'Download YouTube thumbnails in HD quality.'
      };
    }

    return res.status(200).json({
      reply: aiReply,
      tool
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: 'AI failed'
    });
  }
}