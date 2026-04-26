import { useState } from 'react';
import { Upload, Download, Trash } from 'lucide-react';
import jsPDF from 'jspdf';

export default function ImageToPdf() {
  const [images, setImages] = useState<File[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages([...images, ...Array.from(e.target.files)]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const generatePdf = async () => {
    if (images.length === 0) return;

    const pdf = new jsPDF();

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const imgData = await fileToDataURL(file);

      const img = new Image();
      img.src = imgData;

      await new Promise((res) => {
        img.onload = () => {
          const width = pdf.internal.pageSize.getWidth();
          const height = (img.height * width) / img.width;

          if (i !== 0) pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, 0, width, height);

          res(null);
        };
      });
    }

    pdf.save('images.pdf');
  };

  const fileToDataURL = (file: File) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer">
        <Upload className="mb-2" />
        Upload Images
        <input type="file" multiple accept="image/*" hidden onChange={handleUpload} />
      </label>

      {images.length > 0 && (
        <div className="space-y-2">
          {images.map((img, i) => (
            <div key={i} className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <span className="text-sm">{img.name}</span>
              <button onClick={() => removeImage(i)}>
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={generatePdf}
        className="w-full bg-blue-600 text-white py-3 rounded-xl"
      >
        <Download className="inline mr-2" />
        Convert to PDF
      </button>
    </div>
  );
}