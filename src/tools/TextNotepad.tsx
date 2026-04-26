import { useState, useEffect } from 'react';
import { Type, Download, Copy, Save } from 'lucide-react';

export default function TextNotepad() {
  const [text, setText] = useState('');
  const [savedStatus, setSavedStatus] = useState('Saved');

  useEffect(() => {
    const saved = localStorage.getItem('toolbox_notepad');
    if (saved) setText(saved);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setSavedStatus('Saving...');
    
    // Debounced save
    const timeoutId = setTimeout(() => {
      localStorage.setItem('toolbox_notepad', e.target.value);
      setSavedStatus('Saved');
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  };

  const download = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `notes-${new Date().toISOString().split('T')[0]}.txt`;
    link.href = url;
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 px-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Type className="text-gray-400" size={20} />
          <span className="font-bold dark:text-white">Quick Notepad</span>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded ml-4 flex items-center">
            <Save size={12} className="mr-1"/> {savedStatus}
          </span>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => navigator.clipboard.writeText(text)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Copy">
            <Copy size={20} />
          </button>
          <button onClick={download} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Download TXT">
            <Download size={20} />
          </button>
        </div>
      </div>

      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Start typing... Everything is auto-saved to your browser."
        className="w-full h-[600px] p-8 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-3xl focus:border-blue-500 outline-none dark:text-white text-lg resize-none shadow-sm leading-relaxed"
      />
      
      <div className="flex justify-between text-sm font-bold text-gray-400 px-4">
        <span>{text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
        <span>{text.length} characters</span>
      </div>
    </div>
  );
}
