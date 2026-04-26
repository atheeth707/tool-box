import { useState } from 'react';
import { Youtube, Download, Image as ImageIcon } from 'lucide-react';

export default function YtThumbnailDownloader() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);

  const extractId = (input: string) => {
    const match = input.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (match && match[1]) {
      setVideoId(match[1]);
    } else {
      setVideoId(null);
    }
    setUrl(input);
  };

  const qualities = [
    { name: 'Maximum Resolution (1080p)', res: 'maxresdefault' },
    { name: 'High Quality (720p)', res: 'hqdefault' },
    { name: 'Medium Quality (360p)', res: 'mqdefault' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-xl">
            <Youtube className="text-red-600 dark:text-red-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">YouTube Thumbnail Downloader</h2>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">YouTube Video URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => extractId(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-red-500 outline-none text-lg"
          />
        </div>
      </div>

      {videoId ? (
        <div className="space-y-8">
          {qualities.map((q) => {
            const imgUrl = `https://img.youtube.com/vi/${videoId}/${q.res}.jpg`;
            return (
              <div key={q.res} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">{q.name}</h3>
                  <a 
                    href={imgUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors shadow-sm text-sm"
                  >
                    <Download size={16} className="mr-2" /> Open / Save
                  </a>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 flex justify-center">
                  <img 
                    src={imgUrl} 
                    alt={`Thumbnail ${q.name}`} 
                    className="max-w-full rounded-xl shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<div class="text-gray-400 p-8 text-center">This resolution is not available for this video.</div>';
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : url.length > 10 ? (
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-3xl font-medium border border-red-100 dark:border-red-800/30">
          Invalid YouTube URL. Please check the link and try again.
        </div>
      ) : (
        <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
          <p>Paste a YouTube URL above to view and download its thumbnails.</p>
        </div>
      )}
    </div>
  );
}
