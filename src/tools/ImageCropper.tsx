import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, Crop, RefreshCcw, Maximize, Smartphone, Image as ImageIcon, Info } from 'lucide-react';

// --- Types ---
type AspectRatio = 'Free' | '1:1' | '16:9' | '4:3';

export default function AdvancedImageStudio() {
  const [image, setImage] = useState<string | null>(null);
  const [imgDims, setImgDims] = useState({ width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 });
  const [crop, setCrop] = useState({ x: 10, y: 10, width: 80, height: 80 });
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('Free');
  const [isProcessing, setIsProcessing] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Image Upload & Initialization ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return alert('File too large (Max 10MB)');

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setAspectRatio('Free'); // Reset on new image
    };
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
    setImgDims({ width, height, naturalWidth, naturalHeight });
    setCrop({ x: 10, y: 10, width: 80, height: 80 });
  };

  // --- Advanced Math: Handle Aspect Ratio Logic ---
  const updateCrop = useCallback((side: string, value: number) => {
    setCrop(prev => {
      const newCrop = { ...prev, [side]: value };
      
      if (aspectRatio !== 'Free') {
        const [wRatio, hRatio] = aspectRatio.split(':').map(Number);
        if (side === 'width') newCrop.height = (newCrop.width * hRatio) / wRatio;
        if (side === 'height') newCrop.width = (newCrop.height * wRatio) / hRatio;
      }
      
      // Boundary enforcement
      if (newCrop.x + newCrop.width > 100) newCrop.x = 100 - newCrop.width;
      if (newCrop.y + newCrop.height > 100) newCrop.y = 100 - newCrop.height;
      
      return newCrop;
    });
  }, [aspectRatio]);

  // --- High-Performance Download Engine ---
  const handleDownload = async () => {
    if (!image || !imgRef.current) return;
    setIsProcessing(true);

    const img = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });

    // Calculate pixel-perfect coordinates
    const scaleX = img.naturalWidth / 100;
    const scaleY = img.naturalHeight / 100;
    
    const sWidth = Math.floor(crop.width * scaleX);
    const sHeight = Math.floor(crop.height * scaleY);
    const sx = Math.floor(crop.x * scaleX);
    const sy = Math.floor(crop.y * scaleY);

    canvas.width = sWidth;
    canvas.height = sHeight;

    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `pro-crop-${Date.now()}.png`;
        link.click();
        URL.revokeObjectURL(url);
        setIsProcessing(false);
      }, 'image/png', 1.0);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 animate-in fade-in duration-700">
      {!image ? (
        <div className="relative group">
          <label className="flex flex-col items-center justify-center w-full h-[500px] border-4 border-slate-200 border-dashed rounded-[3rem] cursor-pointer bg-white hover:bg-slate-50 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex flex-col items-center justify-center relative z-10">
              <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 mb-6 group-hover:rotate-12 transition-transform duration-500">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-2">Advanced Cropper</h2>
              <p className="text-slate-500 font-medium">PNG, JPG, WEBP • Max 10MB</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Panel: Controls */}
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-xl flex items-center gap-2">
                  <div className="w-2 h-6 bg-blue-600 rounded-full" /> Controls
                </h3>
                <button onClick={() => setImage(null)} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors">
                  <RefreshCcw size={20} />
                </button>
              </div>

              {/* Aspect Ratio Selector */}
              <div className="space-y-3 mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aspect Ratio</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['Free', '1:1', '16:9', '4:3'] as AspectRatio[]).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-3 px-4 rounded-2xl text-sm font-bold transition-all ${
                        aspectRatio === ratio 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Precise Range Inputs */}
              <div className="space-y-6">
                <ControlSlider label="X-Offset" value={crop.x} onChange={(v) => updateCrop('x', v)} />
                <ControlSlider label="Y-Offset" value={crop.y} onChange={(v) => updateCrop('y', v)} />
                <ControlSlider label="Width" value={crop.width} onChange={(v) => updateCrop('width', v)} />
                <ControlSlider label="Height" value={crop.height} onChange={(v) => updateCrop('height', v)} disabled={aspectRatio !== 'Free'} />
              </div>

              <button 
                onClick={handleDownload}
                disabled={isProcessing}
                className="w-full mt-8 py-5 bg-slate-900 dark:bg-blue-600 hover:bg-black text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? <RefreshCcw className="animate-spin" /> : <Download size={22} />}
                Export Cropped Image
              </button>
            </div>

            {/* Metadata Card */}
            <div className="bg-blue-600 p-6 rounded-[2.5rem] text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Info size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Image Engine Info</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] opacity-60">Source Resolution</p>
                  <p className="text-lg font-black">{imgDims.naturalWidth} × {imgDims.naturalHeight}</p>
                </div>
                <div>
                  <p className="text-[10px] opacity-60">Target Size</p>
                  <p className="text-lg font-black">
                    {Math.round((crop.width / 100) * imgDims.naturalWidth)} × {Math.round((crop.height / 100) * imgDims.naturalHeight)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Advanced Canvas View */}
          <div className="xl:col-span-8">
            <div className="bg-slate-100 dark:bg-slate-950 rounded-[3rem] p-8 h-full flex flex-col items-center justify-center relative overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
              {/* Background Decoration */}
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              
              <div className="relative max-w-full" ref={containerRef}>
                {/* Underlay Image */}
                <img 
                  ref={imgRef}
                  src={image} 
                  onLoad={onImageLoad}
                  alt="Source" 
                  className="max-h-[60vh] object-contain opacity-20 grayscale"
                />
                
                {/* The "Lens" - Crop Area */}
                <div 
                  className="absolute border-2 border-blue-500 shadow-[0_0_0_10000px_rgba(0,0,0,0.6)] z-20 overflow-hidden flex items-center justify-center group"
                  style={{
                    top: `${crop.y}%`,
                    left: `${crop.x}%`,
                    width: `${crop.width}%`,
                    height: `${crop.height}%`,
                  }}
                >
                  <img 
                    src={image} 
                    alt="Preview"
                    className="max-w-none absolute"
                    style={{
                      width: `${imgDims.width}px`,
                      height: `${imgDims.height}px`,
                      top: `-${(crop.y / 100) * imgDims.height}px`,
                      left: `-${(crop.x / 100) * imgDims.width}px`,
                    }}
                  />
                  {/* Grid Overlay */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30 pointer-events-none group-hover:opacity-60 transition-opacity">
                    <div className="border border-white/50" /><div className="border border-white/50" /><div className="border border-white/50" />
                    <div className="border border-white/50" /><div className="border border-white/50" /><div className="border border-white/50" />
                    <div className="border border-white/50" /><div className="border border-white/50" /><div className="border border-white/50" />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex gap-6 text-slate-400">
                <div className="flex items-center gap-2"><Maximize size={14}/> <span className="text-[10px] font-bold uppercase tracking-widest">Hardware Accelerated</span></div>
                <div className="flex items-center gap-2"><Smartphone size={14}/> <span className="text-[10px] font-bold uppercase tracking-widest">Retina Export Ready</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Component for UI consistency
function ControlSlider({ label, value, onChange, disabled = false }: { label: string, value: number, onChange: (v: number) => void, disabled?: boolean }) {
  return (
    <div className={disabled ? 'opacity-30 pointer-events-none' : ''}>
      <div className="flex justify-between mb-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{value}%</span>
      </div>
      <input 
        type="range" 
        min="0" max="100" 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600 h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer"
      />
    </div>
  );
}