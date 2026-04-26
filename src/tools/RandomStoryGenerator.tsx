import { useState } from 'react';
import { BookOpen, RefreshCw, Copy } from 'lucide-react';

export default function RandomStoryGenerator() {
  const [story, setStory] = useState('');

  const chars = ['A brave knight', 'An exhausted programmer', 'A rogue AI', 'A mysterious cat', 'A time-traveling chef', 'A forgotten king'];
  const places = ['in a cyberpunk city', 'at the edge of the universe', 'inside a haunted basement', 'on a floating island', 'in a coffee shop', 'within a digital simulation'];
  const actions = ['discovered a hidden portal', 'accidentally deleted the internet', 'found a legendary sword', 'befriended a dragon', 'started a rebellion', 'won a high-stakes poker game'];
  const twists = ['but it was all a dream.', 'and then the simulation crashed.', 'which led to the end of the world.', 'but they lost their memory.', 'and they lived happily ever after.', 'but the real enemy was themselves.'];

  const generate = () => {
    const c = chars[Math.floor(Math.random() * chars.length)];
    const p = places[Math.floor(Math.random() * places.length)];
    const a = actions[Math.floor(Math.random() * actions.length)];
    const t = twists[Math.floor(Math.random() * twists.length)];
    setStory(`${c} ${p} ${a}, ${t}`);
  };

  useState(() => generate());

  return (
    <div className="max-w-2xl mx-auto space-y-8 text-center">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold dark:text-white mb-8">Random Story Prompt Generator</h2>

        <div className="min-h-[150px] flex items-center justify-center bg-amber-50 dark:bg-amber-900/10 p-8 rounded-2xl border border-amber-100 dark:border-amber-800/30 mb-8 relative group">
          <p className="text-2xl font-bold text-amber-900 dark:text-amber-300 leading-relaxed">
            "{story}"
          </p>
          <button onClick={() => navigator.clipboard.writeText(story)} className="absolute top-4 right-4 p-2 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-100 rounded-lg">
            <Copy size={16} />
          </button>
        </div>

        <button onClick={generate} className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
          <RefreshCw size={20} className="mr-2" /> Generate New Story
        </button>
      </div>
    </div>
  );
}
