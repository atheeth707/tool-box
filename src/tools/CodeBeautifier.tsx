import { useState } from 'react';
import { Wand2, Copy } from 'lucide-react';

export default function CodeBeautifier() {
  const [code, setCode] = useState('');
  const [lang, setLang] = useState('json');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const beautify = () => {
    setError('');
    try {
      if (!code.trim()) return setOutput('');
      
      if (lang === 'json') {
        setOutput(JSON.stringify(JSON.parse(code), null, 2));
      } else if (lang === 'css') {
        const formatted = code
          .replace(/\s*([{}:;,])\s*/g, '$1') // remove spaces
          .replace(/\{/g, ' {\n  ')
          .replace(/\}/g, '\n}\n')
          .replace(/;/g, ';\n  ')
          .replace(/,\s*/g, ', ')
          .replace(/\n\s*\n/g, '\n');
        setOutput(formatted.trim());
      } else if (lang === 'html') {
        let formatted = '';
        let indent = 0;
        const lines = code.replace(/>\s*</g, '>\n<').split('\n');
        
        lines.forEach(line => {
          if (line.match(/^<\/\w/)) indent -= 1;
          formatted += '  '.repeat(Math.max(0, indent)) + line + '\n';
          if (line.match(/^<\w[^>]*[^\/]>.*$/) && !line.match(/<\/\w+>$/)) indent += 1;
        });
        setOutput(formatted.trim());
      }
    } catch (e: any) {
      setError(e.message || 'Invalid code format');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-fuchsia-50 dark:bg-fuchsia-900/30 p-3 rounded-xl">
              <Wand2 className="text-fuchsia-600 dark:text-fuchsia-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold dark:text-white">Code Beautifier</h2>
          </div>
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none dark:text-white font-bold">
            <option value="json">JSON</option>
            <option value="css">CSS</option>
            <option value="html">HTML</option>
          </select>
        </div>

        {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl font-mono text-sm">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Minified / Messy Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-fuchsia-500 outline-none font-mono text-sm resize-none whitespace-pre"
            />
            <button onClick={beautify} className="w-full mt-4 py-4 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl font-bold transition-colors">
              Beautify Code
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Beautified Output</label>
            <textarea
              value={output}
              readOnly
              className="w-full h-96 p-5 bg-gray-900 border-2 border-gray-800 rounded-2xl text-green-400 outline-none font-mono text-sm resize-none whitespace-pre"
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
