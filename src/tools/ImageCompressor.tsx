import { useState, useRef } from 'react';
import { Upload, Download, Settings } from 'lucide-react';

export default function ImageCompressor() {
  const [image, setImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert('File size exceeds 5MB limit.');
    
    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      compressImage(event.target?.result as string, 80);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (src: string, q: number) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        setCompressedSize(blob.size);
        if (compressedUrl) URL.revokeObjectURL(compressedUrl);
        setCompressedUrl(URL.createObjectURL(blob));
      }, 'image/jpeg', q / 100);
    };
    img.src = src;
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = Number(e.target.value);
    setQuality(q);
    if (image) compressImage(image, q);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {!image ? (
        <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-blue-300 border-dashed rounded-3xl cursor-pointer bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-blue-500" />
            </div>
            <p className="mb-2 text-lg text-gray-700 dark:text-gray-300"><span className="font-bold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop</p>
            <p className="text-sm text-gray-500">Max file size: 5MB</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold dark:text-white flex items-center"><Settings className="mr-3 text-blue-500" size={24}/> Compression Settings</h3>
            <button onClick={() => {setImage(null); setCompressedUrl(null);}} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 rounded-lg transition-colors">Choose Different Image</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  <span>Quality</span>
                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-0.5 rounded">{quality}%</span>
                </div>
                <input 
                  type="range" min="1" max="100" value={quality} onChange={handleQualityChange}
                  className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Original Size:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatBytes(originalSize)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Compressed Size:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">{formatBytes(compressedSize)}</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">Savings:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{Math.round((1 - compressedSize/originalSize) * 100)}%</span>
                </div>
              </div>

              {compressedUrl && (
                <a href={compressedUrl} download="compressed-image.jpg" className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-blue-500/30">
                  <Download size={20} />
                  <span>Download Compressed Image</span>
                </a>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 flex justify-center items-center overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-700 min-h-[300px]">
              {compressedUrl && <img src={compressedUrl} alt="Preview" className="max-w-full max-h-80 object-contain rounded shadow-sm" />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
