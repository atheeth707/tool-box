import { useState } from 'react';
import { Upload, Copy } from 'lucide-react';

export default function ImageToBase64() {
  const [base64, setBase64] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert('File size exceeds 5MB limit.');
    const reader = new FileReader();
    reader.onload = (event) => setBase64(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {!base64 ? (
        <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-blue-300 border-dashed rounded-3xl cursor-pointer bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-blue-500" />
            </div>
            <p className="mb-2 text-lg text-gray-700 dark:text-gray-300"><span className="font-bold text-blue-600 dark:text-blue-400">Click to upload image</span></p>
            <p className="text-sm text-gray-500">Max file size: 5MB</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold dark:text-white">Base64 Output</h3>
            <button onClick={() => setBase64('')} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-xl transition-colors">Start Over</button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 flex justify-center items-start">
              <img src={base64} alt="Preview" className="max-w-full max-h-64 object-contain rounded shadow-sm border border-gray-200 dark:border-gray-700" />
            </div>
            <div className="w-full md:w-2/3 relative">
              <textarea
                value={base64}
                readOnly
                className="w-full h-64 p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-3xl outline-none dark:text-white text-sm font-mono shadow-sm resize-none"
              />
              <button onClick={() => navigator.clipboard.writeText(base64)} className="absolute bottom-6 right-6 flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors font-bold">
                <Copy size={18} className="mr-2" /> Copy Base64
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
