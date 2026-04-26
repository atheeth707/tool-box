import { useState } from 'react';
import { Eye, Globe } from 'lucide-react';

export default function LinkPreview() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPreview = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    setData(null);

    try {
      // Use allorigins to bypass CORS for client-side fetching
      const targetUrl = url.startsWith('http') ? url : `https://${url}`;
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
      const json = await res.json();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(json.contents, 'text/html');
      
      const getMeta = (name: string, property: string) => {
        return doc.querySelector(`meta[name="${name}"]`)?.getAttribute('content') || 
               doc.querySelector(`meta[property="${property}"]`)?.getAttribute('content');
      };

      const title = getMeta('title', 'og:title') || doc.querySelector('title')?.innerText || 'No Title Found';
      const description = getMeta('description', 'og:description') || 'No description available for this page.';
      const image = getMeta('image', 'og:image');
      const domain = new URL(targetUrl).hostname;

      setData({ title, description, image, domain, url: targetUrl });
    } catch (e) {
      setError('Failed to generate preview. The site might block automated requests.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-cyan-50 dark:bg-cyan-900/30 p-3 rounded-xl">
            <Eye className="text-cyan-600 dark:text-cyan-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Link Preview Generator</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-cyan-500 outline-none text-lg"
          />
          <button 
            onClick={fetchPreview}
            disabled={loading}
            className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-400 text-white rounded-2xl font-bold transition-colors shadow-sm"
          >
            {loading ? 'Generating...' : 'Generate Preview'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-bold border border-red-100 dark:border-red-800/30">
          {error}
        </div>
      )}

      {data && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-center">
          <div className="max-w-lg w-full border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <a href={data.url} target="_blank" rel="noreferrer" className="block">
              <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 relative">
                {data.image ? (
                  <img src={data.image} alt={data.title} className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Globe size={48} className="opacity-50" />
                  </div>
                )}
              </div>
              <div className="p-5 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{data.domain}</div>
                <div className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-2 line-clamp-2">{data.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{data.description}</div>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
