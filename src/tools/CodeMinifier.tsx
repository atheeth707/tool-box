import { useState } from 'react';
import { Minimize2, Copy } from 'lucide-react';

export default function CodeMinifier() {
  const [code, setCode] = useState('');
  const [lang, setLang] = useState('css');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const minify = () => {
    setError('');
    try {
      if (!code.trim()) return setOutput('');
      
      let minified = code;
      if (lang === 'json') {
        minified = JSON.stringify(JSON.parse(code));
      } else if (lang === 'css') {
        minified = code
          .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
          .replace(/\s+/g, ' ') // remove extra spaces
          .replace(/\s*([{}:;,])\s*/g, '$1') // remove spaces around symbols
          .trim();
      } else if (lang === 'html') {
        minified = code
          .replace(/<!--[\s\S]*?-->/g, '') // remove comments
          .replace(/\s+/g, ' ') // remove extra spaces
          .replace(/> \s*</g, '><') // remove spaces between tags
          .trim();
      } else if (lang === 'js') {
        minified = code
          .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // remove comments
          .replace(/\s+/g, ' ') // remove extra spaces
          .replace(/\s*([{}:;,=+\-*/<>()[\]])\s*/g, '$1') // remove spaces around symbols
          .trim();
      }
      setOutput(minified);
    } catch (e: any) {
      setError(e.message || 'Invalid code format');
    }
  };

  const getSavings = () => {
    if (!code || !output) return 0;
    return Math.round((1 - output.length / code.length) * 100);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-xl">
              <Minimize2 className="text-emerald-600 dark:text-emerald-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold dark:text-white">Code Minifier</h2>
          </div>
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none dark:text-white font-bold">
            <option value="css">CSS</option>
            <option value="html">HTML</option>
            <option value="js">JavaScript</option>
            <option value="json">JSON</option>
          </select>
        </div>

        {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl font-mono text-sm">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Original Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-80 p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-emerald-500 outline-none font-mono text-sm resize-none whitespace-pre"
            />
            <button onClick={minify} className="w-full mt-4 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors">
              Minify Code
            </button>
          </div>
          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Minified Output</label>
              {output && <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Saved {getSavings()}%</span>}
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full h-80 p-5 bg-gray-900 border-2 border-gray-800 rounded-2xl text-emerald-400 outline-none font-mono text-sm resize-none break-all"
            />
            {output && (
              <button onClick={() => navigator.clipboard.writeText(output)} className="absolute bottom-4 right-4 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl shadow-sm transition-colors">
                <Copy size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
