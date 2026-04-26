import { useState } from 'react';
import { Upload, Download, RotateCcw, RotateCw } from 'lucide-react';

export default function ImageRotator() {
  const [image, setImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert('File size exceeds 5MB limit.');
    const reader = new FileReader();
    reader.onload = (event) => setImage(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!image) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (rotation % 180 === 0) {
        canvas.width = img.width;
        canvas.height = img.height;
      } else {
        canvas.width = img.height;
        canvas.height = img.width;
      }

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'rotated-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    img.src = image;
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
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center space-y-8">
          <div className="flex justify-center items-center space-x-6">
            <button onClick={() => setRotation(r => r - 90)} className="p-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-full transition-colors shadow-sm">
              <RotateCcw size={24} />
            </button>
            <div className="font-mono font-bold text-xl dark:text-white w-20">{((rotation % 360) + 360) % 360}°</div>
            <button onClick={() => setRotation(r => r + 90)} className="p-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-full transition-colors shadow-sm">
              <RotateCw size={24} />
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 flex justify-center items-center border-2 border-dashed border-gray-200 dark:border-gray-700 min-h-[400px] overflow-hidden">
            <img 
              src={image} 
              alt="Preview" 
              className="max-w-full max-h-96 object-contain shadow-lg transition-transform duration-300"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
          </div>

          <div className="flex justify-center space-x-4">
            <button onClick={() => {setImage(null); setRotation(0);}} className="px-6 py-3 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-xl transition-colors">Start Over</button>
            <button onClick={handleDownload} className="flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/30">
              <Download size={20} className="mr-2" /> Download Rotated Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
