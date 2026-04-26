import { useState } from 'react';
import { Info, Video } from 'lucide-react';

export default function VideoMetadata() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMetadata = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        setData(json);
      }
    } catch (e) {
      setError('Failed to fetch metadata. The URL might not be supported.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-xl">
            <Info className="text-indigo-600 dark:text-indigo-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Video Metadata Viewer</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube or Vimeo URL..."
            className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-indigo-500 outline-none text-lg"
          />
          <button 
            onClick={fetchMetadata}
            disabled={loading}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-2xl font-bold transition-colors shadow-sm"
          >
            {loading ? 'Fetching...' : 'Get Metadata'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-bold border border-red-100 dark:border-red-800/30">
          {error}
        </div>
      )}

      {data && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {data.thumbnail_url ? (
              <img src={data.thumbnail_url} alt="Thumbnail" className="w-full rounded-2xl shadow-sm mb-4" />
            ) : (
              <div className="w-full h-48 bg-gray-100 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
                <Video size={48} />
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-500 uppercase mb-1">Title</div>
              <div className="font-bold text-gray-900 dark:text-white">{data.title || 'N/A'}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-500 uppercase mb-1">Author / Channel</div>
              <div className="font-bold text-gray-900 dark:text-white">{data.author_name || 'N/A'}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-500 uppercase mb-1">Provider</div>
              <div className="font-bold text-gray-900 dark:text-white">{data.provider_name || 'N/A'}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-500 uppercase mb-1">Type</div>
              <div className="font-bold text-gray-900 dark:text-white capitalize">{data.type || 'video'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
