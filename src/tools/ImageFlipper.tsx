import { useState } from 'react';
import { Upload, Download, FlipHorizontal, FlipVertical } from 'lucide-react';

export default function ImageFlipper() {
  const [image, setImage] = useState<string | null>(null);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

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

      ctx.translate(flipH ? img.width : 0, flipV ? img.height : 0);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'flipped-image.png';
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
            <button onClick={() => setFlipH(!flipH)} className={`flex items-center px-6 py-3 rounded-xl font-bold transition-colors shadow-sm ${flipH ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
              <FlipHorizontal size={20} className="mr-2" /> Flip Horizontal
            </button>
            <button onClick={() => setFlipV(!flipV)} className={`flex items-center px-6 py-3 rounded-xl font-bold transition-colors shadow-sm ${flipV ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
              <FlipVertical size={20} className="mr-2" /> Flip Vertical
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 flex justify-center items-center border-2 border-dashed border-gray-200 dark:border-gray-700 min-h-[400px] overflow-hidden">
            <img 
              src={image} 
              alt="Preview" 
              className="max-w-full max-h-96 object-contain shadow-lg transition-transform duration-300"
              style={{ transform: `scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})` }}
            />
          </div>

          <div className="flex justify-center space-x-4">
            <button onClick={() => {setImage(null); setFlipH(false); setFlipV(false);}} className="px-6 py-3 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-xl transition-colors">Start Over</button>
            <button onClick={handleDownload} className="flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/30">
              <Download size={20} className="mr-2" /> Download Flipped Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
