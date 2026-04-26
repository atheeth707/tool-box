import { useState } from 'react';
import { Share2, Copy } from 'lucide-react';

export default function SocialShareGenerator() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text);

  const links = [
    { name: 'Twitter / X', url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText || encodedTitle}`, color: 'bg-black text-white' },
    { name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: 'bg-blue-600 text-white' },
    { name: 'LinkedIn', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, color: 'bg-blue-700 text-white' },
    { name: 'WhatsApp', url: `https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`, color: 'bg-green-500 text-white' },
    { name: 'Telegram', url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`, color: 'bg-sky-500 text-white' },
    { name: 'Reddit', url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`, color: 'bg-orange-500 text-white' },
    { name: 'Email', url: `mailto:?subject=${encodedTitle}&body=${encodedText} ${encodedUrl}`, color: 'bg-gray-600 text-white' },
  ];

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <Share2 className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Share Link Generator</h2>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">URL to Share *</label>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none" />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Check out this awesome site!" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message / Text (Twitter & Email)</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Optional message..." className="w-full h-24 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none resize-none" />
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold dark:text-white mb-6">Generated Links</h3>
        
        {url ? (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {links.map(link => (
              <div key={link.name} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${link.color}`}>{link.name}</span>
                <div className="flex space-x-2">
                  <button onClick={() => navigator.clipboard.writeText(link.url)} className="p-2 text-gray-500 hover:text-blue-600 bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Copy URL">
                    <Copy size={18} />
                  </button>
                  <a href={link.url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-colors">
                    Test Link
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 font-medium">
            Enter a URL to generate share links
          </div>
        )}
      </div>
    </div>
  );
}
