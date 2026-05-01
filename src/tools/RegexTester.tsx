import React, { useState, useMemo } from 'react';
import { Search, AlertCircle, Info, Hash, Zap, Copy, Check } from 'lucide-react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('[A-Z][a-z]+');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Hello World! This is a Regex Tester 2026.');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Advanced Match Processing
  const { nodes, matchCount, time } = useMemo(() => {
    const startTime = performance.now();
    if (!pattern) return { nodes: text, matchCount: 0, time: 0 };
    
    try {
      setError('');
      // Force global flag for highlighting visibility, but respect user choice for others
      const safeFlags = flags.includes('g') ? flags : flags + 'g';
      const re = new RegExp(pattern, safeFlags);
      
      const matches = [];
      let match;
      let count = 0;

      // Protection against zero-length match infinite loops
      while ((match = re.exec(text)) !== null) {
        matches.push({ 
          start: match.index, 
          end: match.index + match[0].length, 
          text: match[0] 
        });
        count++;
        if (match[0].length === 0) re.lastIndex++;
        if (count > 5000) break; // Safety break
      }

      const elements = [];
      let lastIndex = 0;
      
      matches.forEach((m, i) => {
        if (m.start > lastIndex) {
          elements.push(text.slice(lastIndex, m.start));
        }
        elements.push(
          <mark 
            key={i} 
            className="bg-indigo-200 dark:bg-indigo-500/50 text-indigo-900 dark:text-indigo-100 rounded-sm px-0.5 border-b-2 border-indigo-400 shadow-sm transition-colors"
          >
            {m.text}
          </mark>
        );
        lastIndex = m.end;
      });

      elements.push(text.slice(lastIndex));
      
      return { 
        nodes: elements, 
        matchCount: count, 
        time: (performance.now() - startTime).toFixed(2) 
      };
    } catch (err: any) {
      setError(err.message);
      return { nodes: text, matchCount: 0, time: 0 };
    }
  }, [pattern, flags, text]);

  const copyRegex = () => {
    navigator.clipboard.writeText(`/${pattern}/${flags}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Editor Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20">
                  <Search className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Regex Engine</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">v2.0 High Performance</p>
                </div>
              </div>
              <button 
                onClick={copyRegex}
                className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} className="text-slate-400" />}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center border border-red-100 dark:border-red-800/30 animate-in slide-in-from-top-2">
                <AlertCircle size={18} className="mr-3 shrink-0" />
                <span className="font-mono text-xs font-bold leading-tight">{error}</span>
              </div>
            )}

            {/* Pattern Inputs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1 relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-2xl group-focus-within:text-indigo-500 transition-colors">/</span>
                <input 
                  type="text" 
                  value={pattern} 
                  onChange={e => setPattern(e.target.value)} 
                  placeholder="enter pattern..."
                  className="w-full p-5 pl-10 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white focus:border-indigo-500 outline-none font-mono text-lg transition-all" 
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-2xl group-focus-within:text-indigo-500 transition-colors">/</span>
              </div>
              <div className="sm:w-32 relative">
                <input 
                  type="text" 
                  value={flags} 
                  onChange={e => setFlags(e.target.value)} 
                  placeholder="gim"
                  className="w-full p-5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white focus:border-indigo-500 outline-none font-mono text-lg text-center" 
                />
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                <Hash size={14} className="text-indigo-600" />
                <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">{matchCount} Matches</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <Zap size={14} className="text-amber-500" />
                <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{time}ms</span>
              </div>
            </div>

            {/* Textarea Section */}
            <div className="relative">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Source Text</label>
              <div className="relative h-[400px] overflow-hidden rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  className="absolute inset-0 w-full h-full p-8 bg-transparent outline-none text-transparent caret-indigo-600 dark:caret-white font-mono text-lg resize-none z-10 leading-relaxed scrollbar-hide"
                  spellCheck="false"
                />
                <div className="absolute inset-0 w-full h-full p-8 font-mono text-lg leading-relaxed whitespace-pre-wrap break-words overflow-y-auto pointer-events-none text-slate-700 dark:text-slate-300">
                  {nodes}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Reference */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Info className="text-indigo-400" />
              <h3 className="font-black uppercase tracking-widest text-sm">Cheat Sheet</h3>
            </div>
            
            <div className="space-y-4 font-mono text-[11px]">
              {[
                { key: '.', desc: 'Any character except newline' },
                { key: '\\d', desc: 'Any digit (0-9)' },
                { key: '\\w', desc: 'Word character (a-z, 0-9, _)' },
                { key: '\\s', desc: 'Whitespace (space, tab, etc)' },
                { key: '[abc]', desc: 'Any character in the set' },
                { key: '^ / $', desc: 'Start / End of string' },
                { key: '?', desc: 'Zero or one (optional)' },
                { key: '*', desc: 'Zero or more' },
                { key: '+', desc: 'One or more' },
                { key: '(...)', desc: 'Capture group' },
              ].map(item => (
                <div key={item.key} className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-indigo-400 font-bold">{item.key}</span>
                  <span className="text-slate-400">{item.desc}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-indigo-600 rounded-2xl flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Zap size={16} />
              </div>
              <p className="text-[10px] font-bold leading-tight">Pro Tip: Use for group matches in large texts.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Supported Flags</h4>
             <div className="space-y-2">
               <div className="flex gap-2"><span className="font-mono text-indigo-600">g</span><span className="text-xs text-slate-500">Global (find all matches)</span></div>
               <div className="flex gap-2"><span className="font-mono text-indigo-600">i</span><span className="text-xs text-slate-500">Case-insensitive</span></div>
               <div className="flex gap-2"><span className="font-mono text-indigo-600">m</span><span className="text-xs text-slate-500">Multiline mode</span></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}