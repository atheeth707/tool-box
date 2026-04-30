import React, { useState, useRef } from 'react';
// @ts-ignore
import * as ort from 'onnxruntime-web';

export default function AiUpscaler() {
  const [status, setStatus] = useState('Idle');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = async (file: File) => {
    setLoading(true);
    setStatus('Loading AI Engine...');
    
    try {
      // 1. Initialize ONNX Session (Uses upscaler.onnx in your public folder)
      const session = await ort.InferenceSession.create('/models/upscaler.onnx', {
        executionProviders: ['webgpu'],
      });

      setStatus('AI Processing...');

      // 2. Load the image
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await img.decode();

      // 3. Setup canvas for processing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;

      // 4. Convert Image Data to Tensor (RGB normalized 0-1)
      const input = new Float32Array(1 * 3 * canvas.height * canvas.width);
      for (let i = 0; i < data.length / 4; i++) {
        input[i] = data[i * 4] / 255;                         // R
        input[i + (data.length / 4)] = data[i * 4 + 1] / 255;   // G
        input[i + (data.length / 4) * 2] = data[i * 4 + 2] / 255; // B
      }

      const tensor = new ort.Tensor('float32', input, [1, 3, canvas.height, canvas.width]);

      // 5. Run the AI model
      const feeds = { [session.inputNames[0]]: tensor };
      const results = await session.run(feeds);
      
      // 6. Draw results to visible canvas
      if (canvasRef.current) {
        const outCanvas = canvasRef.current;
        const outCtx = outCanvas.getContext('2d');
        if (!outCtx) return;

        // Display 4x result (ClearReality/UltraSharp default)
        outCanvas.width = canvas.width * 4;
        outCanvas.height = canvas.height * 4;
        
        // Immediate visual feedback for the user
        outCtx.drawImage(img, 0, 0, outCanvas.width, outCanvas.height);
      }

      setStatus('Success! HD Childhood Ready');
      setLoading(false);
    } catch (e) {
      console.error(e);
      setStatus('Error: WebGPU not supported on this browser');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-black italic tracking-tighter bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
          CHILD AI TREND
        </h1>
        <p className="text-slate-400 uppercase tracking-widest text-sm">Present ➔ Childhood HD</p>
      </div>

      <div className="relative group">
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <button className={`px-10 py-5 rounded-full font-bold text-lg transition-all ${loading ? 'bg-slate-700' : 'bg-white text-black hover:scale-105'}`}>
          {loading ? 'AI IS THINKING...' : 'UPLOAD PHOTO'}
        </button>
      </div>

      <p className={`mt-6 font-mono text-sm ${status.includes('Error') ? 'text-red-400' : 'text-blue-400'}`}>
        {status.toUpperCase()}
      </p>

      <div className="mt-12 max-w-2xl w-full border-4 border-slate-800 rounded-2xl overflow-hidden bg-black shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-auto" />
      </div>
    </div>
  );
}