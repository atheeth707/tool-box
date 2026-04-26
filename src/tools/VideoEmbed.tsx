import { useState } from 'react';
import { PlaySquare } from 'lucide-react';

export default function VideoEmbed() {
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

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-xl">
            <PlaySquare className="text-red-600 dark:text-red-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Clean Video Embed Player</h2>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">YouTube Video URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => extractId(e.target.value)}
            placeholder="Paste a YouTube link to watch without distractions..."
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-red-500 outline-none text-lg"
          />
        </div>
      </div>

      {videoId ? (
        <div className="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video md:aspect-video relative">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
        </div>
      ) : url.length > 10 ? (
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-3xl font-medium border border-red-100 dark:border-red-800/30">
          Invalid YouTube URL. Please check the link.
        </div>
      ) : null}
    </div>
  );
}
