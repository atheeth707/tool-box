import React, { useState, useMemo } from 'react';
import { FileEdit, Eye, Code, Copy, Check } from 'lucide-react';

export default function MarkdownPreviewer() {
  const [md, setMd] = useState(
    '# Hello Markdown\n\n' +
    'This is a **Pro Previewer**. Write some code:\n\n' +
    '```javascript\nconst hello = "world";\n```\n\n' +
    '- High performance\n' +
    '- Real-time rendering\n' +
    '- Clean UI\n\n' +
    '> "The best way to predict the future is to invent it." - Alan Kay'
  );
  const [copied, setCopied] = useState(false);

  // Use useMemo to prevent unnecessary re-parsing on every small render
  const htmlContent = useMemo(() => {
    let lines = md.split('\n');
    let inList = false;
    let inCode = false;

    const parsedLines = lines.map((line) => {
      // 1. Handle Code Blocks
      if (line.startsWith('```')) {
        inCode = !inCode;
        return inCode 
          ? '<pre class="bg-slate-900 text-slate-100 p-4 rounded-xl my-4 font-mono text-sm overflow-x-auto">' 
          : '</pre>';
      }
      if (inCode) return `<code>${line}</code>\n`;

      // 2. Escape HTML
      let processed = line.replace(/</g, '&lt;').replace(/>/g, '&gt;');

      // 3. Blockquotes
      if (processed.startsWith('> ')) {
        return `<blockquote class="border-l-4 border-indigo-500 pl-4 py-2 my-4 bg-indigo-50 dark:bg-indigo-900/20 italic text-slate-700 dark:text-slate-300">${processed.slice(2)}</blockquote>`;
      }

      // 4. Headers
      processed = processed
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2 text-slate-900 dark:text-white">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2 text-slate-900 dark:text-white">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-black mt-8 mb-4 border-b border-slate-200 dark:border-slate-700 pb-3 text-slate-900 dark:text-white">$1</h1>');

      // 5. Lists (Basic)
      if (processed.startsWith('- ')) {
        processed = `<li class="ml-6 list-disc mb-1 text-slate-700 dark:text-slate-300">${processed.slice(2)}</li>`;
      }

      // 6. Inline Formatting (Bold, Italic, Links)
      processed = processed
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">$1</a>');

      return processed === '' ? '<br/>' : processed;
    });

    return parsedLines.join('');
  }, [md]);

  const handleCopy = () => {
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col h-[85vh]">
        
        {/* Toolbar */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <FileEdit className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">MARKDOWN <span className="text-indigo-600 font-medium">LIVE</span></h2>
          </div>
          
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:border-indigo-500 transition-all active:scale-95 shadow-sm"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy Raw'}
          </button>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Editor Side */}
          <div className="flex-1 flex flex-col border-r border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
              <Code size={14} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Source Editor</span>
            </div>
            <textarea
              value={md}
              onChange={(e) => setMd(e.target.value)}
              className="flex-1 w-full p-8 bg-transparent dark:text-slate-200 focus:outline-none font-mono text-sm leading-relaxed resize-none selection:bg-indigo-100 dark:selection:bg-indigo-900/40"
              placeholder="Start writing markdown..."
            />
          </div>

          {/* Preview Side */}
          <div className="flex-1 flex flex-col bg-slate-50/30 dark:bg-slate-950/20">
            <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
              <Eye size={14} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Preview</span>
            </div>
            <div 
              className="flex-1 w-full p-8 overflow-y-auto preview-area"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>

        </div>

        {/* Footer info */}
        <div className="px-8 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Characters: {md.length}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Words: {md.trim() === '' ? 0 : md.trim().split(/\s+/).length}</span>
        </div>
      </div>
    </div>
  );
}