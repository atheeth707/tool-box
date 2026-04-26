import { useState, useRef, useEffect } from 'react';
import { Upload, Download, Crop } from 'lucide-react';

export default function ImageCropper() {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ top: 10, bottom: 10, left: 10, right: 10 });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert('File size exceeds 5MB limit.');
    const reader = new FileReader();
    reader.onload = (event) => setImage(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!image || !imgRef.current) return;
    const img = imgRef.current;
    
    const canvas = document.createElement('canvas');
    const sx = img.naturalWidth * (crop.left / 100);
    const sy = img.naturalHeight * (crop.top / 100);
    const sWidth = img.naturalWidth * (1 - crop.left / 100 - crop.right / 100);
    const sHeight = img.naturalHeight * (1 - crop.top / 100 - crop.bottom / 100);
    
    if (sWidth <= 0 || sHeight <= 0) return alert('Invalid crop area');

    canvas.width = sWidth;
    canvas.height = sHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'cropped-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
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
            <h3 className="text-xl font-bold dark:text-white flex items-center"><Crop className="mr-3 text-blue-500" size={24}/> Adjust Crop Area</h3>
            <button onClick={() => setImage(null)} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 rounded-lg transition-colors">Choose Different Image</button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              {['top', 'bottom', 'left', 'right'].map((side) => (
                <div key={side}>
                  <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 capitalize">
                    <span>{side} Margin</span>
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-0.5 rounded">
                      {crop[side as keyof typeof crop]}%
                    </span>
                  </div>
                  <input 
                    type="range" min="0" max="45" value={crop[side as keyof typeof crop]} 
                    onChange={(e) => setCrop({...crop, [side]: Number(e.target.value)})}
                    className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
              ))}
              
              <button onClick={handleDownload} className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-blue-500/30 mt-6">
                <Download size={20} />
                <span>Crop & Download</span>
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 flex justify-center items-center border-2 border-dashed border-gray-200 dark:border-gray-700 min-h-[300px] relative overflow-hidden">
              <img ref={imgRef} src={image} alt="Original" className="max-w-full max-h-80 object-contain absolute opacity-30" />
              <div className="relative max-w-full max-h-80 overflow-hidden shadow-2xl border-2 border-blue-500" style={{
                clipPath: `inset(${crop.top}% ${crop.right}% ${crop.bottom}% ${crop.left}%)`
              }}>
                <img src={image} alt="Cropped Preview" className="max-w-full max-h-80 object-contain block" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
