import { useState, useRef, useEffect } from 'react';
import { Download, Upload, Image as ImageIcon } from 'lucide-react';

export default function MemeGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [topText, setTopText] = useState('TOP TEXT');
  const [bottomText, setBottomText] = useState('BOTTOM TEXT');
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
      // Calculate dimensions to fit max width while maintaining aspect ratio
      const maxWidth = 800;
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // Draw Image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Text Settings
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = canvas.width / 150;
      ctx.textAlign = 'center';
      
      // Dynamic font size based on canvas width
      const fontSize = canvas.width / 10;
      ctx.font = `900 ${fontSize}px Impact, sans-serif`;

      // Draw Top Text
      ctx.textBaseline = 'top';
      ctx.fillText(topText.toUpperCase(), canvas.width / 2, 20);
      ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 20);

      // Draw Bottom Text
      ctx.textBaseline = 'bottom';
      ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
      ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
    };
    img.src = image;
  }, [image, topText, bottomText]);

  const downloadMeme = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'meme.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        <h2 className="text-2xl font-bold dark:text-white mb-6">Meme Settings</h2>
        
        {!image ? (
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-blue-300 border-dashed rounded-2xl cursor-pointer bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 transition-all">
            <Upload className="w-8 h-8 text-blue-500 mb-2" />
            <span className="font-bold text-blue-600 dark:text-blue-400">Upload Image Template</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        ) : (
          <button onClick={() => setImage(null)} className="w-full py-3 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl font-bold">
            Change Image
          </button>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Top Text</label>
          <input type="text" value={topText} onChange={(e) => setTopText(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none font-bold" />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bottom Text</label>
          <input type="text" value={bottomText} onChange={(e) => setBottomText(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none font-bold" />
        </div>

        {image && (
          <button onClick={downloadMeme} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center mt-6 shadow-lg shadow-blue-500/30">
            <Download size={20} className="mr-2" /> Download Meme
          </button>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center min-h-[400px] overflow-hidden">
        {image ? (
          <canvas ref={canvasRef} className="max-w-full h-auto rounded-xl shadow-md" />
        ) : (
          <div className="text-gray-400 flex flex-col items-center">
            <ImageIcon size={48} className="mb-4 opacity-50" />
            <p>Upload an image to see preview</p>
          </div>
        )}
      </div>
    </div>
  );
}
