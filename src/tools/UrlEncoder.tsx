import { useState } from 'react';
import { Copy } from 'lucide-react';

export default function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode'|'decode'>('encode');

  const process = () => {
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch (e) {
      setOutput('Error: Invalid URL encoding');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-center space-x-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-2xl w-max mx-auto">
        <button 
          onClick={() => { setMode('encode'); setOutput(''); }}
          className={`px-8 py-3 rounded-xl font-semibold transition-all ${mode === 'encode' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
        >Encode URL</button>
        <button 
          onClick={() => { setMode('decode'); setOutput(''); }}
          className={`px-8 py-3 rounded-xl font-semibold transition-all ${mode === 'decode' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
        >Decode URL</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="font-semibold text-gray-700 dark:text-gray-300 ml-2">Input String</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 p-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-3xl focus:border-blue-500 outline-none dark:text-white text-lg font-mono shadow-sm"
            placeholder={mode === 'encode' ? 'Enter URL to encode...' : 'Enter encoded URL to decode...'}
          />
        </div>
        <div className="space-y-3 relative">
          <label className="font-semibold text-gray-700 dark:text-gray-300 ml-2">Result</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-3xl outline-none dark:text-white text-lg font-mono shadow-sm"
            placeholder="Result will appear here..."
          />
          {output && (
            <button onClick={() => navigator.clipboard.writeText(output)} className="absolute bottom-5 right-5 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors" title="Copy output">
              <Copy size={20} />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex justify-center">
        <button 
          onClick={process}
          className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-colors shadow-lg shadow-blue-500/30"
        >
          {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
        </button>
      </div>
    </div>
  );
}
