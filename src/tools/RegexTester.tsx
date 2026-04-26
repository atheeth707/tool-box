import { useState, useMemo } from 'react';
import { Search, AlertCircle } from 'lucide-react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('[A-Z][a-z]+');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Hello World! This is a Regex Tester.');
  const [error, setError] = useState('');

  const highlightedText = useMemo(() => {
    if (!pattern) return <span className="text-gray-800 dark:text-gray-200">{text}</span>;
    
    try {
      setError('');
      const safeFlags = flags.includes('g') ? flags : flags + 'g';
      const re = new RegExp(pattern, safeFlags);
      
      const matches = [];
      let match;
      while ((match = re.exec(text)) !== null) {
        matches.push({ start: match.index, end: match.index + match[0].length, text: match[0] });
        if (match[0].length === 0) re.lastIndex++;
      }

      if (matches.length === 0) return <span className="text-gray-800 dark:text-gray-200">{text}</span>;

      const nodes = [];
      let lastIndex = 0;
      
      matches.forEach((m, i) => {
        if (m.start > lastIndex) {
          nodes.push(<span key={`t-${i}`} className="text-gray-800 dark:text-gray-200">{text.slice(lastIndex, m.start)}</span>);
        }
        nodes.push(<mark key={`m-${i}`} className="bg-amber-300 dark:bg-amber-600 text-gray-900 dark:text-white rounded px-0.5 shadow-sm">{m.text}</mark>);
        lastIndex = m.end;
      });

      if (lastIndex < text.length) {
        nodes.push(<span key="t-last" className="text-gray-800 dark:text-gray-200">{text.slice(lastIndex)}</span>);
      }

      return <>{nodes}</>;
    } catch (err: any) {
      setError(err.message);
      return <span className="text-gray-800 dark:text-gray-200">{text}</span>;
    }
  }, [pattern, flags, text]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <Search className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Regex Tester</h2>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center border border-red-100 dark:border-red-800/30">
            <AlertCircle size={20} className="mr-2 shrink-0" />
            <span className="font-mono text-sm">{error}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">/</span>
            <input 
              type="text" 
              value={pattern} 
              onChange={e => setPattern(e.target.value)} 
              placeholder="pattern"
              className="w-full p-4 pl-8 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none font-mono text-lg" 
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">/</span>
          </div>
          <div className="w-full md:w-32">
            <input 
              type="text" 
              value={flags} 
              onChange={e => setFlags(e.target.value)} 
              placeholder="flags (g, i, m)"
              className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none font-mono text-lg text-center" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Test String</label>
          <div className="relative">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              className="w-full h-64 p-6 bg-transparent border-2 border-gray-200 dark:border-gray-700 rounded-3xl outline-none text-transparent caret-gray-900 dark:caret-white font-mono text-lg resize-none z-10 relative"
              spellCheck="false"
            />
            <div className="absolute top-0 left-0 w-full h-full p-6 pt-[26px] pl-[26px] font-mono text-lg whitespace-pre-wrap break-words overflow-hidden z-0 pointer-events-none">
              {highlightedText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
