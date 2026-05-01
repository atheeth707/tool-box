import React, { useState, useRef, useEffect } from 'react';
import { Download, Upload, Image as ImageIcon, Palette, Type, Sliders } from 'lucide-react';

export default function MemeGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [topText, setTopText] = useState('TOP TEXT');
  const [bottomText, setBottomText] = useState('BOTTOM TEXT');
  
  // New Style States
  const [textColor, setTextColor] = useState('#ffffff');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(60);
  const [fontFamily, setFontFamily] = useState('Impact');
  const [filter, setFilter] = useState({
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    sepia: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setImage(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const maxWidth = 800;
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // 1. Apply Color Grading Filters to Context
      ctx.filter = `
        brightness(${filter.brightness}%) 
        contrast(${filter.contrast}%) 
        grayscale(${filter.grayscale}%) 
        sepia(${filter.sepia}%)
      `;

      // 2. Draw Image with Filters
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // 3. Reset Filter for Text (we don't want text to be sepia/grayscale)
      ctx.filter = 'none';

      // 4. Advanced Text Styling
      ctx.fillStyle = textColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = canvas.width / 100;
      ctx.lineJoin = 'round';
      ctx.textAlign = 'center';
      
      const dynamicFontSize = (canvas.width / 600) * fontSize;
      ctx.font = `900 ${dynamicFontSize}px ${fontFamily}, sans-serif`;

      // Helper for Text Effects (Shadows/Stroke)
      const drawStyledText = (text: string, x: number, y: number, baseline: CanvasTextBaseline) => {
        ctx.textBaseline = baseline;
        // Text Shadow for extra "pop"
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 10;
        ctx.strokeText(text.toUpperCase(), x, y);
        ctx.shadowBlur = 0; // Disable shadow for fill to keep it crisp
        ctx.fillText(text.toUpperCase(), x, y);
      };

      drawStyledText(topText, canvas.width / 2, 30, 'top');
      drawStyledText(bottomText, canvas.width / 2, canvas.height - 30, 'bottom');
    };
    img.src = image;
  }, [image, topText, bottomText, textColor, strokeColor, fontSize, fontFamily, filter]);

  const downloadMeme = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'meme-pro.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
      
      {/* Left Panel: Controls */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-6">
            <Sliders className="text-blue-600" size={20} />
            <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter">Studio Controls</h2>
          </div>

          {!image ? (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-blue-400 border-dashed rounded-3xl cursor-pointer bg-blue-50/30 hover:bg-blue-50 transition-all mb-6">
              <Upload className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-xs font-black uppercase text-blue-600">Import Template</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          ) : (
            <button onClick={() => setImage(null)} className="w-full py-2 text-xs font-black uppercase text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl mb-6">Change Background</button>
          )}

          <div className="space-y-4">
            {/* Text Inputs */}
            <div className="space-y-2">
              <input type="text" placeholder="Top Text" value={topText} onChange={(e) => setTopText(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold" />
              <input type="text" placeholder="Bottom Text" value={bottomText} onChange={(e) => setBottomText(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold" />
            </div>

            {/* Typography Section */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4 text-slate-400">
                <Type size={14} /> <span className="text-[10px] font-black uppercase">Typography</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-bold">
                  <option value="Impact">Impact</option>
                  <option value="Arial">Arial</option>
                  <option value="Comic Sans MS">Comic Sans</option>
                  <option value="Verdana">Verdana</option>
                </select>
                <input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-bold" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[8px] font-bold uppercase text-slate-400 block mb-1">Fill</label>
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-8 rounded cursor-pointer" />
                </div>
                <div className="flex-1">
                  <label className="text-[8px] font-bold uppercase text-slate-400 block mb-1">Outline</label>
                  <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="w-full h-8 rounded cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Color Grading Section */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4 text-slate-400">
                <Palette size={14} /> <span className="text-[10px] font-black uppercase">Color Grading</span>
              </div>
              {Object.entries(filter).map(([key, value]) => (
                <div key={key} className="mb-2">
                  <div className="flex justify-between text-[9px] font-bold uppercase text-slate-500 mb-1">
                    <span>{key}</span>
                    <span>{value}%</span>
                  </div>
                  <input 
                    type="range" min="0" max={key === 'brightness' || key === 'contrast' ? '200' : '100'} 
                    value={value} 
                    onChange={(e) => setFilter({...filter, [key]: Number(e.target.value)})}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              ))}
            </div>
          </div>

          {image && (
            <button onClick={downloadMeme} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center mt-8 shadow-xl shadow-blue-500/30">
              <Download size={18} className="mr-2" /> Export Meme
            </button>
          )}
        </div>
      </div>

      {/* Right Panel: Canvas Preview */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-950 rounded-[3rem] p-8 flex items-center justify-center min-h-[500px] border-4 border-dashed border-slate-200 dark:border-slate-800">
        {image ? (
          <div className="relative group">
            <canvas ref={canvasRef} className="max-w-full h-auto rounded-2xl shadow-2xl transition-transform group-hover:scale-[1.01]" />
            <div className="absolute top-4 right-4 bg-black/50 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md">Live Preview</div>
          </div>
        ) : (
          <div className="text-center opacity-30">
            <ImageIcon size={64} className="mx-auto mb-4" />
            <p className="font-black uppercase tracking-widest text-sm">Waiting for Template...</p>
          </div>
        )}
      </div>
    </div>
  );
}