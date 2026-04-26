import { useState } from 'react';
import { Copy, Code } from 'lucide-react';

export default function MetaTagGenerator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [robotsIndex, setRobotsIndex] = useState('index');
  const [robotsFollow, setRobotsFollow] = useState('follow');

  const generateTags = () => {
    let tags = [];
    if (title) tags.push(`<title>${title}</title>`);
    if (description) tags.push(`<meta name="description" content="${description}">`);
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}">`);
    if (author) tags.push(`<meta name="author" content="${author}">`);
    tags.push(`<meta name="robots" content="${robotsIndex}, ${robotsFollow}">`);
    tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);
    tags.push(`<meta charset="UTF-8">`);
    return tags.join('\n');
  };

  const output = generateTags();

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <Code className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Meta Tags</h2>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Site Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Max 60 characters" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none" />
          <div className={`text-xs mt-1 ${title.length > 60 ? 'text-red-500' : 'text-gray-500'}`}>{title.length} / 60</div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Site Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Max 160 characters" className="w-full h-24 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none resize-none" />
          <div className={`text-xs mt-1 ${description.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>{description.length} / 160</div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Keywords (comma separated)</label>
          <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="keyword1, keyword2, keyword3" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Author</label>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="John Doe" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Robots Index</label>
            <select value={robotsIndex} onChange={(e) => setRobotsIndex(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none">
              <option value="index">Index</option>
              <option value="noindex">No Index</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Robots Follow</label>
            <select value={robotsFollow} onChange={(e) => setRobotsFollow(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none">
              <option value="follow">Follow</option>
              <option value="nofollow">No Follow</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-800 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Generated HTML</h3>
          <button onClick={() => navigator.clipboard.writeText(output)} className="flex items-center text-sm bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Copy size={16} className="mr-2" /> Copy
          </button>
        </div>
        <textarea
          readOnly
          value={output}
          className="flex-1 w-full p-4 bg-gray-950 border border-gray-800 rounded-2xl text-green-400 font-mono text-sm outline-none resize-none whitespace-pre"
        />
      </div>
    </div>
  );
}
