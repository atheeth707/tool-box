import React, { useState, useEffect } from 'react';
import { Play, Pause, Download, Volume2 } from 'lucide-react';

interface InstantSound {
  id: string;
  title: string;
  mp3: string;
  views: string;
}

const InstantSoundboard = () => {
  const [sounds, setSounds] = useState<InstantSound[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Fetch trending audios on mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch('https://myinstants-api.vercel.app/trending');
        const data = await response.json();
        // Assuming the API returns an array of results
        setSounds(data.results || []);
      } catch (error) {
        console.error("Error loading sounds:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const togglePlay = (sound: InstantSound) => {
    if (playingId === sound.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = sound.mp3;
        audioRef.current.play();
        setPlayingId(sound.id);
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Trending Audios...</div>;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Volume2 className="text-blue-500" /> Trending Instant Sounds
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sounds.map((sound) => (
          <div key={sound.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate mb-3" title={sound.title}>
              {sound.title}
            </h3>
            
            <div className="flex items-center justify-between">
              <button 
                onClick={() => togglePlay(sound)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors"
              >
                {playingId === sound.id ? <Pause size={20} /> : <Play size={20} />}
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{sound.views} views</span>
                <a 
                  href={sound.mp3} 
                  download={`${sound.title}.mp3`}
                  className="text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <Download size={20} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <audio 
        ref={audioRef} 
        onEnded={() => setPlayingId(null)} 
        className="hidden"
      />
    </div>
  );
};

export default InstantSoundboard;