import { useState } from 'react';
import { Upload, Download, FileImage } from 'lucide-react';

export default function PngToJpg() {
  const [image, setImage] = useState<string | null>(null);

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
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      // Fill white background in case of transparent PNG
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'converted-image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/jpeg', 0.9);
    };
    img.src = image;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 text-center">
      {!image ? (
        <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-blue-300 border-dashed rounded-3xl cursor-pointer bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-blue-500" />
            </div>
            <p className="mb-2 text-lg text-gray-700 dark:text-gray-300"><span className="font-bold text-blue-600 dark:text-blue-400">Upload PNG Image</span></p>
            <p className="text-sm text-gray-500">Max file size: 5MB</p>
          </div>
          <input type="file" className="hidden" accept="image/png" onChange={handleImageUpload} />
        </label>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-center items-center mb-8 space-x-4">
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg font-bold text-gray-600 dark:text-gray-300">PNG</span>
            <span className="text-gray-400">→</span>
            <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg font-bold text-blue-600 dark:text-blue-400">JPG</span>
          </div>
          
          <img src={image} alt="Preview" className="max-w-full max-h-80 object-contain mx-auto rounded shadow-sm mb-8" />
          
          <div className="flex justify-center space-x-4">
            <button onClick={() => setImage(null)} className="px-6 py-3 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-xl transition-colors">Start Over</button>
            <button onClick={handleDownload} className="flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/30">
              <Download size={20} className="mr-2" /> Download JPG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
