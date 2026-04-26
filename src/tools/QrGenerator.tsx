import { useState } from 'react';
import { Download, QrCode } from 'lucide-react';

export default function QrGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(300);

  const qrUrl = text ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&margin=10` : '';

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <QrCode className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>

      <div className="mb-8">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter URL, text, or contact info..."
          className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-lg text-center"
        />
      </div>
      
      <div className="flex justify-center items-center min-h-[300px] bg-gray-50 dark:bg-gray-900 rounded-3xl mb-8 border-2 border-dashed border-gray-200 dark:border-gray-700 p-4">
        {qrUrl ? (
          <img src={qrUrl} alt="QR Code" className="rounded-xl shadow-sm max-w-full" />
        ) : (
          <div className="text-gray-400 dark:text-gray-500 flex flex-col items-center">
            <QrCode className="w-12 h-12 mb-2 opacity-50" />
            <p>Your QR code will appear here</p>
          </div>
        )}
      </div>

      <a
        href={qrUrl}
        download="qrcode.png"
        target="_blank"
        rel="noreferrer"
        className={`w-full flex items-center justify-center space-x-2 py-4 rounded-2xl font-bold text-lg transition-all ${qrUrl ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700 cursor-not-allowed'}`}
        onClick={e => !qrUrl && e.preventDefault()}
      >
        <Download size={20} />
        <span>Download QR Code</span>
      </a>
    </div>
  );
}
