import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, Eraser, Pipette, RotateCcw, Sliders } from 'lucide-react';

type Mode = 'chroma' | 'brush';

export default function BackgroundRemover() {
  const [image, setImage] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('chroma');
  const [targetColor, setTargetColor] = useState('#ffffff');
  const [tolerance, setTolerance] = useState(40);
  const [brushSize, setBrushSize] = useState(24);
  const [isPainting, setIsPainting] = useState(false);
  const [originalData, setOriginalData] = useState<ImageData | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const displayRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const drawToCanvas = useCallback((src: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setOriginalData(data);
      syncDisplay();
    };
    img.src = src;
  }, []);

  const syncDisplay = () => {
    const canvas = canvasRef.current;
    const display = displayRef.current;
    if (!canvas || !display) return;
    display.width = canvas.width;
    display.height = canvas.height;
    const ctx = display.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, display.width, display.height);
    ctx.drawImage(canvas, 0, 0);
  };

  useEffect(() => {
    if (image) drawToCanvas(image);
  }, [image, drawToCanvas]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return alert('Max file size is 10MB.');
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const colorDistance = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) =>
    Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);

  const applyChromaKey = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { r: tr, g: tg, b: tb } = hexToRgb(targetColor);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const thresh = tolerance * 2.55;
    for (let i = 0; i < data.length; i += 4) {
      if (colorDistance(data[i], data[i + 1], data[i + 2], tr, tg, tb) < thresh) {
        data[i + 3] = 0;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    syncDisplay();
  };

  const pickColorFromCanvas = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'chroma') return;
    const display = displayRef.current;
    if (!display) return;
    const rect = display.getBoundingClientRect();
    const scaleX = display.width / rect.width;
    const scaleY = display.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(v => v.toString(16).padStart(2, '0')).join('');
    setTargetColor(hex);
  };

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const display = displayRef.current;
    if (!display) return { x: 0, y: 0 };
    const rect = display.getBoundingClientRect();
    const scaleX = display.width / rect.width;
    const scaleY = display.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const erase = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'brush' || !isPainting) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasPos(e);
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    syncDisplay();
  };

  const handleReset = () => {
    const canvas = canvasRef.current;
    if (!canvas || !originalData) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.putImageData(originalData, 0, 0);
    syncDisplay();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'background-removed.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {!image ? (
        <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-blue-300 border-dashed rounded-3xl cursor-pointer bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-blue-500" />
            </div>
            <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
              <span className="font-bold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
        </label>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">

          {/* Mode Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setMode('chroma')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${mode === 'chroma' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              <Pipette size={16} /> Chroma Key
            </button>
            <button
              onClick={() => setMode('brush')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${mode === 'brush' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              <Eraser size={16} /> Brush Eraser
            </button>
            <button onClick={() => setImage(null)} className="ml-auto px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 rounded-xl transition-colors">
              New Image
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls */}
            <div className="space-y-4">
              {mode === 'chroma' ? (
                <>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click on the image to pick the background color, then hit Remove.
                  </p>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Target Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={targetColor}
                        onChange={(e) => setTargetColor(e.target.value)}
                        className="w-12 h-10 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer"
                      />
                      <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{targetColor}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <span className="flex items-center gap-1"><Sliders size={14} /> Tolerance</span>
                      <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-0.5 rounded">{tolerance}</span>
                    </div>
                    <input type="range" min="1" max="100" value={tolerance} onChange={(e) => setTolerance(Number(e.target.value))}
                      className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                    <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Precise</span><span>Wide</span></div>
                  </div>
                  <button onClick={applyChromaKey} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/30">
                    Remove Background
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Paint over the background with your mouse to erase it.
                  </p>
                  <div>
                    <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <span>Brush Size</span>
                      <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-0.5 rounded">{brushSize}px</span>
                    </div>
                    <input type="range" min="4" max="80" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="rounded-full border-2 border-blue-500 bg-transparent" style={{ width: Math.min(brushSize, 48), height: Math.min(brushSize, 48) }} />
                    <span className="text-xs text-gray-500">Brush preview</span>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-2">
                <button onClick={handleReset} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors">
                  <RotateCcw size={15} /> Reset
                </button>
                <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors shadow-lg shadow-green-500/30">
                  <Download size={15} /> Save PNG
                </button>
              </div>
            </div>

            {/* Canvas Preview */}
            <div className="lg:col-span-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZTVlN2ViIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNlNWU3ZWIiLz48L3N2Zz4=')] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center min-h-[300px]">
              <canvas
                ref={displayRef}
                onClick={mode === 'chroma' ? pickColorFromCanvas : undefined}
                onMouseDown={() => setIsPainting(true)}
                onMouseUp={() => setIsPainting(false)}
                onMouseLeave={() => setIsPainting(false)}
                onMouseMove={erase}
                className="max-w-full max-h-[400px] object-contain"
                style={{ cursor: mode === 'chroma' ? 'crosshair' : 'cell', display: 'block', margin: 'auto' }}
              />
            </div>
          </div>

          {/* hidden working canvas */}
          <canvas ref={canvasRef} className="hidden" />
          <img ref={imgRef} src={image} className="hidden" alt="" />
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-4 border border-blue-100 dark:border-blue-800">
        <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">How to use</p>
        <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1 list-disc list-inside">
          <li><strong>Chroma Key:</strong> Click any color on the image → adjust tolerance → click Remove Background</li>
          <li><strong>Brush Eraser:</strong> Hold and drag your mouse over areas to erase them manually</li>
          <li>Use Reset to undo all changes and start over</li>
          <li>Save as PNG to keep the transparent background</li>
        </ul>
      </div>
    </div>
  );
}
