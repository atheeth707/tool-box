import { useState } from 'react';
import { Type, Copy } from 'lucide-react';

export default function AsciiBanner() {
  const [text, setText] = useState('HELLO');

  // Extremely basic block letter generator for demo purposes
  const generate = () => {
    if (!text) return '';
    const upper = text.toUpperCase();
    let lines = ['', '', '', '', ''];
    
    for (let char of upper) {
      if (char === 'H') {
        lines[0] += '#   #  '; lines[1] += '#   #  '; lines[2] += '#####  '; lines[3] += '#   #  '; lines[4] += '#   #  ';
      } else if (char === 'E') {
        lines[0] += '#####  '; lines[1] += '#      '; lines[2] += '###    '; lines[3] += '#      '; lines[4] += '#####  ';
      } else if (char === 'L') {
        lines[0] += '#      '; lines[1] += '#      '; lines[2] += '#      '; lines[3] += '#      '; lines[4] += '#####  ';
      } else if (char === 'O') {
        lines[0] += ' ###   '; lines[1] += '#   #  '; lines[2] += '#   #  '; lines[3] += '#   #  '; lines[4] += ' ###   ';
      } else if (char === ' ') {
        lines[0] += '       '; lines[1] += '       '; lines[2] += '       '; lines[3] += '       '; lines[4] += '       ';
      } else {
        // Fallback generic block
        lines[0] += '#####  '; lines[1] += '#   #  '; lines[2] += '#   #  '; lines[3] += '#   #  '; lines[4] += '#####  ';
      }
    }
    return lines.join('\n');
  };

  const output = generate();

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <Type className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold dark:text-white mb-2">ASCII Text Banner</h2>
        <p className="text-gray-500 mb-8">Type H, E, L, O, or spaces (demo font).</p>

        <div className="max-w-md mx-auto">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value.replace(/[^helo\s]/gi, ''))}
            placeholder="Type HELO..."
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-green-500 outline-none text-xl text-center font-bold uppercase"
          />
        </div>
      </div>

      {text && (
        <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 relative overflow-hidden">
          <button onClick={() => navigator.clipboard.writeText(output)} className="absolute top-4 right-4 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl shadow-sm transition-colors">
            <Copy size={20} />
          </button>
          <div className="overflow-x-auto pt-8 pb-4">
            <pre className="text-green-400 font-mono text-xs md:text-sm font-bold leading-tight">
              {output}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
