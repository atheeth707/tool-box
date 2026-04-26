import { useState, useRef, useEffect } from 'react';
import { Upload, Pipette, Copy } from 'lucide-react';

export default function ColorPicker() {
  const [image, setImage] = useState<string | null>(null);
  const [colorHex, setColorHex] = useState<string>('#FFFFFF');
  const [colorRgb, setColorRgb] = useState<string>('rgb(255, 255, 255)');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert('File size exceeds 5MB limit.');
    const reader = new FileReader();
    reader.onload = (event) => setImage(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        // Scale canvas to fit container width for easier clicking
        const maxWidth = canvas.parentElement?.clientWidth || 800;
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = image;
    }
  }, [image]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    setColorRgb(`rgb(${r}, ${g}, ${b})`);
    setColorHex('#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase());
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {!image ? (
        <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-blue-300 border-dashed rounded-3xl cursor-pointer bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-blue-500" />
            </div>
            <p className="mb-2 text-lg text-gray-700 dark:text-gray-300"><span className="font-bold text-blue-600 dark:text-blue-400">Click to upload</span></p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-8">
          <div className="flex justify-between items-center pb-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold dark:text-white flex items-center"><Pipette className="mr-3 text-blue-500" size={24}/> Click Image to Pick Color</h3>
            <button onClick={() => setImage(null)} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 rounded-lg transition-colors">Choose Different Image</button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 flex justify-center items-center border-2 border-dashed border-gray-200 dark:border-gray-700 overflow-hidden cursor-crosshair">
              <canvas ref={canvasRef} onClick={handleCanvasClick} className="max-w-full shadow-sm rounded" />
            </div>

            <div className="w-full lg:w-72 space-y-6">
              <div 
                className="w-full h-32 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-700 transition-colors"
                style={{ backgroundColor: colorHex }}
              ></div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-gray-500 mb-1">HEX</div>
                    <div className="font-mono font-bold text-gray-900 dark:text-white">{colorHex}</div>
                  </div>
                  <button onClick={() => navigator.clipboard.writeText(colorHex)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Copy size={18}/></button>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-gray-500 mb-1">RGB</div>
                    <div className="font-mono font-bold text-gray-900 dark:text-white">{colorRgb}</div>
                  </div>
                  <button onClick={() => navigator.clipboard.writeText(colorRgb)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Copy size={18}/></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
