import { Buffer } from 'buffer';

export const config = {
  runtime: 'edge', // Edge runtime is essential for Vercel speed
};

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const { prompt, mode } = await req.json();
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const HF_TOKEN = process.env.HF_TOKEN;

  try {
    // --- VIDEO MODE (RESTORED) ---
    if (mode === 'video') {
      const res = await fetch("https://api-inference.huggingface.co/models/ali-vilab/text-to-video-ms-1.7b", {
        headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      });
      if (!res.ok) return new Response(JSON.stringify({ error: "Video engine busy. Try again." }));
      
      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      return new Response(JSON.stringify({ data: `data:video/mp4;base64,${base64}`, type: 'video' }));
    }

    // --- IMAGE MODE (SDXL-TURBO) ---
    if (mode === 'image') {
      const res = await fetch("https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo", {
        headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      });
      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      return new Response(JSON.stringify({ data: `data:image/jpeg;base64,${base64}`, type: 'image' }));
    }

    // --- CHAT MODE (GEMINI 1.5 FLASH) ---
    const chatRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await chatRes.json();
    return new Response(JSON.stringify({ text: data.candidates[0].content.parts[0].text, type: 'text' }));

  } catch (err) {
    return new Response(JSON.stringify({ error: "Sync Error. Check Vercel API keys." }));
  }
}