import { useState } from 'react';
import { Upload, Download, RotateCcw } from 'lucide-react';

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
      <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-dashed rounded-2xl cursor-pointer">
        <Upload />
        <p>Upload Images</p>
        <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((img, i) => (
            <img key={i} src={img} className="rounded-xl" />
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={handleDownloadPDF} className="flex-1 bg-green-600 text-white py-3 rounded-xl">
          <Download /> Download PDF
        </button>
        <button onClick={handleReset} className="px-4 py-3 bg-gray-200 rounded-xl">
          <RotateCcw />
        </button>
      </div>
    </div>
  );
}