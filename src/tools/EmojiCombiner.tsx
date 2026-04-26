import { useState } from 'react';
import { SmilePlus, Copy } from 'lucide-react';

export default function EmojiCombiner() {
  const [text, setText] = useState('Happy Birthday');
  const [emoji, setEmoji] = useState('🎉');

  const combine = () => {
    if (!text) return '';
    return text.split(' ').join(` ${emoji} `) + ` ${emoji}`;
  };

  const output = combine();

  return (
    <div className="max-w-3xl mx-auto space-y-8 text-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <SmilePlus className="w-8 h-8 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold dark:text-white mb-8">Emoji Text Combiner</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="md:col-span-3">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text..."
              className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-yellow-500 outline-none text-xl font-bold"
            />
          </div>
          <div>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="Emoji"
              className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-yellow-500 outline-none text-xl text-center"
            />
          </div>
        </div>
      </div>

      {text && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-8 rounded-3xl border border-yellow-200 dark:border-yellow-800/30 relative min-h-[200px] flex items-center justify-center">
          <button onClick={() => navigator.clipboard.writeText(output)} className="absolute top-4 right-4 p-3 bg-white dark:bg-gray-800 text-yellow-600 rounded-xl shadow-sm transition-colors hover:scale-105">
            <Copy size={20} />
          </button>
          <div className="text-3xl font-black text-gray-900 dark:text-white leading-relaxed px-8">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
