import { useState } from 'react';
import { FileEdit } from 'lucide-react';

export default function MarkdownPreviewer() {
  const [md, setMd] = useState('# Hello Markdown\\n\\nWrite **bold** or *italic* text.\\n\\n- List item 1\\n- List item 2\\n\\n[Link to Google](https://google.com)\\n\\n> Blockquotes are cool!');

  const parseMd = (text: string) => {
    let html = text
      .replace(/</g, '&lt;').replace(/>/g, '&gt;') // escape HTML
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-black mt-8 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">$1</h1>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 py-1 my-4 bg-blue-50 dark:bg-blue-900/20 italic">$1</blockquote>')
      .replace(/\\*\\*(.*?)\\*\\*/gim, '<strong>$1</strong>')
      .replace(/\\*(.*?)\\*/gim, '<em>$1</em>')
      .replace(/\\[(.*?)\\]\\((.*?)\\)/gim, '<a href="$2" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>')
      .replace(/^\\- (.*$)/gim, '<li class="ml-6 list-disc mb-1">$1</li>')
      .replace(/\\n/gim, '<br />');
    return html;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <FileEdit className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Markdown Live Preview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Markdown Input</label>
            <textarea
              value={md}
              onChange={(e) => setMd(e.target.value)}
              className="flex-1 w-full p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none font-mono text-sm resize-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Live Preview</label>
            <div 
              className="flex-1 w-full p-6 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white overflow-y-auto prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: parseMd(md) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
