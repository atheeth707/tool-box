import { useState, useEffect } from 'react';
import { Palette, Copy } from 'lucide-react';

export default function ColorConverter() {
  const [hex, setHex] = useState('#3B82F6');
  const [rgb, setRgb] = useState('rgb(59, 130, 246)');
  const [hsl, setHsl] = useState('hsl(217, 90%, 60%)');

  const hexToRgb = (h: string) => {
    let r = 0, g = 0, b = 0;
    if (h.length === 4) {
      r = parseInt(h[1] + h[1], 16);
      g = parseInt(h[2] + h[2], 16);
      b = parseInt(h[3] + h[3], 16);
    } else if (h.length === 7) {
      r = parseInt(h.slice(1, 3), 16);
      g = parseInt(h.slice(3, 5), 16);
      b = parseInt(h.slice(5, 7), 16);
    }
    return `rgb(${r}, ${g}, ${b})`;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
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

  const handleHexChange = (val: string) => {
    setHex(val);
    if (/^#[0-9A-F]{6}$/i.test(val) || /^#[0-9A-F]{3}$/i.test(val)) {
      const r = hexToRgb(val);
      setRgb(r);
      const rgbVals = r.match(/\\d+/g)?.map(Number);
      if (rgbVals) setHsl(rgbToHsl(rgbVals[0], rgbVals[1], rgbVals[2]));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-fuchsia-50 dark:bg-fuchsia-900/30 p-3 rounded-xl">
            <Palette className="text-fuchsia-600 dark:text-fuchsia-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Color Converter</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div 
            className="w-full md:w-48 h-48 rounded-3xl shadow-inner border-4 border-gray-100 dark:border-gray-700 transition-colors"
            style={{ backgroundColor: /^#[0-9A-F]{6}$/i.test(hex) || /^#[0-9A-F]{3}$/i.test(hex) ? hex : '#fff' }}
          ></div>

          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">HEX Code</label>
              <div className="flex">
                <input type="text" value={hex} onChange={e => handleHexChange(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-l-xl dark:text-white focus:border-fuchsia-500 outline-none font-mono font-bold" />
                <button onClick={() => navigator.clipboard.writeText(hex)} className="px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-r-xl transition-colors"><Copy size={20}/></button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">RGB Code</label>
              <div className="flex">
                <input type="text" value={rgb} readOnly className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-l-xl dark:text-white outline-none font-mono font-bold" />
                <button onClick={() => navigator.clipboard.writeText(rgb)} className="px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-r-xl transition-colors"><Copy size={20}/></button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">HSL Code</label>
              <div className="flex">
                <input type="text" value={hsl} readOnly className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-l-xl dark:text-white outline-none font-mono font-bold" />
                <button onClick={() => navigator.clipboard.writeText(hsl)} className="px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-r-xl transition-colors"><Copy size={20}/></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
