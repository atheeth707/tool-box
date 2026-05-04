export const config = {
  runtime: 'edge', // Edge runtime handles streams much better than standard serverless
};

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    const { prompt, mode = 'chat' } = await req.json();
    const HF_TOKEN = process.env.HF_TOKEN;
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    // --- STREAMING CHAT (Fixes Timeouts) ---
    if (mode === 'chat') {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );

      return new Response(response.body, {
        headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
      });
    }

    // --- INSTANT IMAGE (SDXL-Turbo) ---
    if (mode === 'image') {
      const res = await fetch("https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo", {
        headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      });

      if (res.status === 503) return new Response(JSON.stringify({ error: "Engine Waking Up..." }), { status: 200 });
      
      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      return new Response(JSON.stringify({ data: `data:image/jpeg;base64,${base64}`, type: 'image' }), { status: 200 });
    }

  } catch (err) {
    return new Response(JSON.stringify({ error: "Nexus Link Reset" }), { status: 500 });
  }
}