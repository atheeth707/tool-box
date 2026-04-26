import { useState, useEffect } from 'react';
import { ClipboardList, Copy, Trash2, Plus } from 'lucide-react';

export default function ClipboardManager() {
  const [clips, setClips] = useState<{id: string, text: string, time: string}[]>([]);
  const [input, setInput] = useState('');

  // Only store in session storage for privacy
  useEffect(() => {
    const saved = sessionStorage.getItem('toolbox_clipboard');
    if (saved) setClips(JSON.parse(saved));
  }, []);

  const save = (newClips: any[]) => {
    setClips(newClips);
    sessionStorage.setItem('toolbox_clipboard', JSON.stringify(newClips));
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    save([{ id: Date.now().toString(), text: input.trim(), time: new Date().toLocaleTimeString() }, ...clips]);
    setInput('');
  };

  const remove = (id: string) => save(clips.filter(c => c.id !== id));
  const clearAll = () => save([]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-xl">
              <ClipboardList className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold dark:text-white">Clipboard Manager</h2>
              <p className="text-sm text-gray-500">Temporarily store text snippets. Clears when you close the browser.</p>
            </div>
          </div>
          {clips.length > 0 && (
            <button onClick={clearAll} className="text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-colors">
              Clear All
            </button>
          )}
        </div>

        <form onSubmit={add} className="relative mb-8">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text snippet here to save..."
            className="w-full p-4 pr-16 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-indigo-500 outline-none text-lg"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-colors">
            <Plus size={20} />
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clips.map(clip => (
            <div key={clip.id} className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 group relative pr-12">
              <div className="text-xs font-bold text-gray-400 mb-2">{clip.time}</div>
              <div className="text-gray-900 dark:text-white font-mono text-sm whitespace-pre-wrap break-words max-h-32 overflow-y-auto">{clip.text}</div>
              
              <div className="absolute top-4 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => navigator.clipboard.writeText(clip.text)} className="p-2 bg-white dark:bg-gray-800 text-gray-500 hover:text-indigo-600 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" title="Copy">
                  <Copy size={16} />
                </button>
                <button onClick={() => remove(clip.id)} className="p-2 bg-white dark:bg-gray-800 text-gray-500 hover:text-red-500 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {clips.length === 0 && (
            <div className="md:col-span-2 text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-400 font-medium">
              Your clipboard history is empty.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
