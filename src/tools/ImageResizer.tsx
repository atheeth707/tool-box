import { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, Maximize } from 'lucide-react';

export default function ImageResizer() {
  const [image, setImage] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(0);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(event.target?.result as string);
        setWidth(img.width);
        setHeight(img.height);
        setAspectRatio(img.width / img.height);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (maintainRatio && aspectRatio) setHeight(Math.round(val / aspectRatio));
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (maintainRatio && aspectRatio) setWidth(Math.round(val * aspectRatio));
  };

  const downloadResized = async () => {
    if (!image) return;
    
    // Use an off-screen canvas to ensure it works reliably
    const img = new Image();
    
    // Create a promise to handle the image loading
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = image;
    });

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(img, 0, 0, width, height);
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resized-${width}x${height}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up memory
    }, 'image/png');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {!image ? (
        <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-blue-300 border-dashed rounded-3xl cursor-pointer bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all dark:border-blue-800/50 group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-blue-500" />
            </div>
            <p className="mb-2 text-lg text-gray-700 dark:text-gray-300"><span className="font-bold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">PNG, JPG, WEBP formats supported</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold dark:text-white flex items-center"><Maximize className="mr-3 text-blue-500" size={24}/> Resize Dimensions</h3>
            <button onClick={() => setImage(null)} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors">Choose Different Image</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Width (px)</label>
                  <input type="number" value={width} onChange={e => handleWidthChange(Number(e.target.value))} className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white outline-none focus:border-blue-500 text-lg font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Height (px)</label>
                  <input type="number" value={height} onChange={e => handleHeightChange(Number(e.target.value))} className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white outline-none focus:border-blue-500 text-lg font-mono" />
                </div>
              </div>
              
              <div className="flex items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <input type="checkbox" id="ratio" checked={maintainRatio} onChange={e => setMaintainRatio(e.target.checked)} className="mr-3 w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                <label htmlFor="ratio" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">Lock Aspect Ratio</label>
              </div>

              <button onClick={downloadResized} className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-blue-500/30">
                <Download size={20} />
                <span>Download Resized Image</span>
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 flex justify-center items-center overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-700 min-h-[300px]">
              <img src={image} alt="Preview" className="max-w-full max-h-80 object-contain rounded shadow-sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
