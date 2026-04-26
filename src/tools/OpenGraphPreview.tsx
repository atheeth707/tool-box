import { useState } from 'react';
import { Copy, Share2 } from 'lucide-react';

export default function OpenGraphPreview() {
  const [title, setTitle] = useState('My Awesome Website');
  const [desc, setDesc] = useState('This is a description of my awesome website that will show up on social media previews.');
  const [url, setUrl] = useState('https://example.com');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=1000&auto=format&fit=crop');

  const tags = `<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${image}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${desc}">
<meta property="twitter:image" content="${image}">`;

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <Share2 className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">OG Data</h2>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full h-24 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Website URL</label>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none" />
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold dark:text-white mb-4">Social Preview (Twitter / Facebook style)</h3>
          
          <div className="max-w-md border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 mx-auto">
            <div className="w-full h-56 bg-gray-200 dark:bg-gray-800 overflow-hidden">
              {image ? <img src={image} alt="OG Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>}
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase truncate mb-1">{url.replace(/^https?:\/\//, '')}</div>
              <div className="font-bold text-gray-900 dark:text-white truncate mb-1">{title || 'Title goes here'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{desc || 'Description goes here'}</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-800 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Generated HTML Tags</h3>
            <button onClick={() => navigator.clipboard.writeText(tags)} className="flex items-center text-sm bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Copy size={16} className="mr-2" /> Copy
            </button>
          </div>
          <textarea
            readOnly
            value={tags}
            className="w-full h-48 p-4 bg-gray-950 border border-gray-800 rounded-2xl text-blue-400 font-mono text-sm outline-none resize-none whitespace-pre"
          />
        </div>
      </div>
    </div>
  );
}
