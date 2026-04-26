import { useState } from 'react';
import { Link, Copy, ExternalLink } from 'lucide-react';

export default function UrlShortenerMock() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const generate = () => {
    if (!url) return;
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    
    const short = `https://t0is0u.vercel.app/s/${code}`;
    setShortUrl(short);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Link className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold dark:text-white mb-2">URL Shortener (Demo)</h2>
        <p className="text-gray-500 mb-8">Generates a mock short URL locally for demonstration purposes.</p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your long URL here..."
            className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-lg"
          />
          <button 
            onClick={generate}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-colors shadow-sm whitespace-nowrap"
          >
            Shorten URL
          </button>
        </div>

        {shortUrl && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30">
            <div className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase mb-3">Your Shortened URL</div>
            <div className="flex items-center justify-center space-x-4">
              <span className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono break-all">{shortUrl}</span>
              <button onClick={() => navigator.clipboard.writeText(shortUrl)} className="p-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-xl shadow-sm hover:scale-105 transition-transform">
                <Copy size={20} />
              </button>
            </div>
            <div className="mt-4 text-xs text-gray-500">Note: This is a client-side mock. The link will not actually redirect.</div>
          </div>
        )}
      </div>
    </div>
  );
}
