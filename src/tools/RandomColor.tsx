import { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';

export default function RandomColor() {
  const [color, setColor] = useState('#3B82F6');

  const generate = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setColor(randomColor.toUpperCase());
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
  };

  const hexToHsl = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div 
        className="w-full h-64 rounded-3xl shadow-inner transition-colors duration-500 ease-in-out flex items-center justify-center relative group"
        style={{ backgroundColor: color }}
      >
        <button 
          onClick={generate}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/40 px-8 py-4 rounded-2xl font-bold text-xl shadow-lg transition-all flex items-center transform group-hover:scale-105"
        >
          <RefreshCw size={24} className="mr-3" /> Generate New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'HEX', value: color },
          { label: 'RGB', value: hexToRgb(color) },
          { label: 'HSL', value: hexToHsl(color) }
        ].map(format => (
          <div key={format.label} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm text-center relative group">
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">{format.label}</div>
            <div className="font-mono font-medium text-gray-900 dark:text-white truncate px-2">{format.value}</div>
            <button 
              onClick={() => navigator.clipboard.writeText(format.value || '')}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all"
              title="Copy"
            >
              <Copy size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
