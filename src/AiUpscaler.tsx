import React, { useState } from 'react';
import * as ort from 'onnxruntime-web';

export default function AiUpscaler() {
  const [status, setStatus] = useState('Idle');

  const processImage = async (file: File) => {
    setStatus('Loading AI Engine...');
    try {
      // 1. Start the AI session from your public folder
      const session = await ort.InferenceSession.create('/models/upscaler.onnx', {
        executionProviders: ['webgpu'], // Free GPU power!
      });

      setStatus('AI Processing...');
      // 2. Logic to run the upscale goes here...
      
      setStatus('Done!');
    } catch (e) {
      console.error(e);
      setStatus('Error: Hardware not supported');
    }
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-black mb-4">CHILD AI TREND</h1>
      <input 
        type="file" 
        onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0])}
        className="bg-purple-600 text-white p-4 rounded-xl cursor-pointer"
      />
      <p className="mt-4 font-bold text-blue-500">{status}</p>
    </div>
  );
}