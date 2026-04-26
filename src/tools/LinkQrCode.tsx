import { useState } from 'react';
import { QrCode, Download } from 'lucide-react';

export default function LinkQrCode() {
  const [url, setUrl] = useState('');
  const [size, setSize] = useState(300);

  const cleanUrl = url.trim();
  const qrUrl = cleanUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(cleanUrl)}&margin=10` : '';

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <QrCode className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Link to QR Code</h2>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Website URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-lg"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <span>QR Size</span>
            <span>{size}x{size} px</span>
          </div>
          <input 
            type="range" min="100" max="1000" step="50" value={size} 
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center">
        {qrUrl ? (
          <>
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 inline-block">
              <img src={qrUrl} alt="QR Code" className="max-w-full h-auto" style={{ width: Math.min(size, 250) }} />
            </div>
            <a
              href={qrUrl}
              download="link-qrcode.png"
              target="_blank"
              rel="noreferrer"
              className="flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-colors shadow-lg shadow-blue-500/30"
            >
              <Download size={20} className="mr-2" /> Download Image
            </a>
          </>
        ) : (
          <div className="text-center text-gray-400 dark:text-gray-500">
            <QrCode size={64} className="mx-auto mb-4 opacity-50" />
            <p className="font-medium">Enter a URL to generate your QR Code</p>
          </div>
        )}
      </div>
    </div>
  );
}
