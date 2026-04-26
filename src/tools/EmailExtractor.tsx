import { useState } from 'react';
import { Copy, Mail } from 'lucide-react';

export default function EmailExtractor() {
  const [text, setText] = useState('');
  const [emails, setEmails] = useState<string[]>([]);

  const extract = () => {
    const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const found = text.match(regex) || [];
    const unique = [...new Set(found.map(e => e.toLowerCase()))];
    setEmails(unique);
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <Mail className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Text Input</h2>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste large blocks of text, HTML, or CSV data here..."
          className="flex-1 w-full min-h-[300px] p-6 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none resize-none text-lg mb-6"
        />
        <button onClick={extract} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-colors shadow-lg shadow-blue-500/30">
          Extract Emails
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold dark:text-white">Found Emails ({emails.length})</h3>
          {emails.length > 0 && (
            <button onClick={() => navigator.clipboard.writeText(emails.join('\n'))} className="flex items-center text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 px-4 py-2 rounded-lg transition-colors">
              <Copy size={16} className="mr-2" /> Copy All
            </button>
          )}
        </div>
        
        {emails.length > 0 ? (
          <div className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 overflow-y-auto font-mono text-sm dark:text-gray-300 space-y-2 max-h-[400px]">
            {emails.map((email, i) => (
              <div key={i} className="py-2 border-b border-gray-200 dark:border-gray-800 last:border-0">{email}</div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-400 dark:text-gray-500 min-h-[400px]">
            No emails extracted yet
          </div>
        )}
      </div>
    </div>
  );
}
