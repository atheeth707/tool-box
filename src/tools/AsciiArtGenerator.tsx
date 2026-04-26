import { useState, useRef } from 'react';
import { Upload, Copy } from 'lucide-react';

export default function AsciiArtGenerator() {
  const [ascii, setAscii] = useState('');
  const [resolution, setResolution] = useState(100);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => processImage(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const processImage = (src: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Calculate new dimensions (ASCII chars are roughly 2x as tall as they are wide)
      const width = resolution;
      const height = Math.floor((img.height / img.width) * width * 0.55);

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      
      const chars = ['@', '%', '#', '*', '+', '=', '-', ':', '.', ' '];
      let asciiStr = '';

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        
        // Calculate brightness
        const brightness = (r + g + b) / 3;
        const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
        
        asciiStr += chars[charIndex];
        
        // Add newline at end of row
        if ((i / 4 + 1) % width === 0) {
          asciiStr += '\n';
        }
      }
      
      setAscii(asciiStr);
    };
    img.src = src;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-6 items-center">
        <label className="flex-1 flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-2xl cursor-pointer bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 transition-all">
          <Upload className="w-6 h-6 text-blue-500 mb-2" />
          <span className="font-bold text-blue-600 dark:text-blue-400">Upload Image to Convert</span>
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>
        
        <div className="w-full md:w-64">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Resolution (Width)</label>
          <input 
            type="range" min="20" max="200" value={resolution} 
            onChange={(e) => setResolution(Number(e.target.value))}
            className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="text-center text-sm font-bold text-gray-500 mt-2">{resolution} chars</div>
        </div>
      </div>

      {ascii && (
        <div className="bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-800 relative overflow-hidden">
          <button onClick={() => navigator.clipboard.writeText(ascii)} className="absolute top-4 right-4 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl shadow-sm transition-colors flex items-center">
            <Copy size={16} className="mr-2" /> Copy ASCII
          </button>
          <div className="overflow-x-auto overflow-y-auto max-h-[600px] w-full pt-8">
            <pre className="text-[8px] leading-[8px] md:text-[10px] md:leading-[10px] font-mono text-green-400 whitespace-pre">
              {ascii}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
