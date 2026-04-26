import { useState } from 'react';
import { Upload, Download, RotateCcw, Image as ImageIcon } from 'lucide-react';

export default function ImageToPdf() {
  const [images, setImages] = useState<string[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const readers = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(setImages);
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Image to PDF</title>
          <style>
            body { margin: 0; }
            img { width: 100%; page-break-after: always; }
          </style>
        </head>
        <body>
          ${images.map(img => `<img src="${img}" />`).join('')}
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleReset = () => setImages([]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Upload Box */}
      <label
        className="
        flex flex-col items-center justify-center w-full h-64 
        border-2 border-dashed rounded-3xl cursor-pointer 
        bg-gray-50 dark:bg-gray-800 
        border-gray-300 dark:border-gray-600 
        hover:bg-gray-100 dark:hover:bg-gray-700 
        transition-all group"
      >
        <div className="flex flex-col items-center gap-3 text-gray-600 dark:text-gray-300">
          <div className="p-4 bg-white dark:bg-gray-900 rounded-full shadow-sm group-hover:scale-110 transition">
            <Upload className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>

          <p className="text-sm font-semibold">
            Click to upload images
          </p>

          <p className="text-xs text-gray-400 dark:text-gray-500">
            PNG, JPG supported • Multiple files allowed
          </p>
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </label>

      {/* Preview */}
      {images.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="text-blue-500" size={18} />
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">
              Preview ({images.length})
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="rounded-xl object-cover h-32 w-full border border-gray-200 dark:border-gray-600"
              />
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      {images.length > 0 && (
        <div className="flex gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-500/30 transition"
          >
            <Download size={18} />
            Download PDF
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-4 border border-blue-100 dark:border-blue-800">
        <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">
          How it works
        </p>
        <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1 list-disc list-inside">
          <li>Upload one or more images</li>
          <li>Click "Download PDF"</li>
          <li>Select <strong>Save as PDF</strong> in the print dialog</li>
        </ul>
      </div>

    </div>
  );
}