import { useState } from 'react';
import { Download } from 'lucide-react';

export default function Base64ToImage() {
  const [base64, setBase64] = useState('');

  const isValidBase64Image = base64.startsWith('data:image/');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Paste Base64 String</label>
        <textarea
          value={base64}
          onChange={(e) => setBase64(e.target.value)}
          placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..."
          className="w-full h-48 p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-3xl focus:border-blue-500 outline-none dark:text-white text-sm font-mono shadow-sm resize-none"
        />
      </div>

      {base64 && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          {isValidBase64Image ? (
            <div className="space-y-6">
              <h3 className="text-xl font-bold dark:text-white">Image Preview</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 flex justify-center items-center border-2 border-dashed border-gray-200 dark:border-gray-700 min-h-[200px]">
                <img src={base64} alt="Decoded Preview" className="max-w-full max-h-96 object-contain rounded shadow-sm" />
              </div>
              <a href={base64} download="decoded-image.png" className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/30">
                <Download size={20} className="mr-2" /> Download Image
              </a>
            </div>
          ) : (
            <div className="p-6 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-2xl font-medium">
              Invalid Base64 Image string. It should start with "data:image/..."
            </div>
          )}
        </div>
      )}
    </div>
  );
}
