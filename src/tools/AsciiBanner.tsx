import { useState } from 'react';
import { Type, Copy } from 'lucide-react';

// A condensed font map for A-Z, 0-9, and basic symbols
const FONT_MAP: Record<string, string[]> = {
  'A': ["  #  ", " # # ", "#####", "#   #", "#   #"],
  'B': ["#### ", "#   #", "#### ", "#   #", "#### "],
  'C': [" ####", "#    ", "#    ", "#    ", " ####"],
  'D': ["#### ", "#   #", "#   #", "#   #", "#### "],
  'E': ["#####", "#    ", "#### ", "#    ", "#####"],
  'F': ["#####", "#    ", "#### ", "#    ", "#    "],
  'G': [" ####", "#    ", "#  ##", "#   #", " ####"],
  'H': ["#   #", "#   #", "#####", "#   #", "#   #"],
  'I': ["#####", "  #  ", "  #  ", "  #  ", "#####"],
  'J': ["    #", "    #", "    #", "#   #", " ### "],
  'K': ["#   #", "#  # ", "###  ", "#  # ", "#   #"],
  'L': ["#    ", "#    ", "#    ", "#    ", "#####"],
  'M': ["#   #", "## ##", "# # #", "#   #", "#   #"],
  'N': ["#   #", "##  #", "# # #", "#  ##", "#   #"],
  'O': [" ### ", "#   #", "#   #", "#   #", " ### "],
  'P': ["#### ", "#   #", "#### ", "#    ", "#    "],
  'Q': [" ### ", "#   #", "#   #", "#  ##", " ####"],
  'R': ["#### ", "#   #", "#### ", "#  # ", "#   #"],
  'S': [" ####", "#    ", " ### ", "    #", "#### "],
  'T': ["#####", "  #  ", "  #  ", "  #  ", "  #  "],
  'U': ["#   #", "#   #", "#   #", "#   #", " ### "],
  'V': ["#   #", "#   #", "#   #", " # # ", "  #  "],
  'W': ["#   #", "#   #", "# # #", "## ##", "#   #"],
  'X': ["#   #", " # # ", "  #  ", " # # ", "#   #"],
  'Y': ["#   #", " # # ", "  #  ", "  #  ", "  #  "],
  'Z': ["#####", "   # ", "  #  ", " #   ", "#####"],
  '0': [" ### ", "#  ##", "# # #", "##  #", " ### "],
  '1': ["  #  ", " ##  ", "  #  ", "  #  ", "#####"],
  '2': [" ### ", "    #", "  ## ", " #   ", "#####"],
  '3': ["#### ", "    #", " ### ", "    #", "#### "],
  '4': ["#  # ", "#  # ", "#####", "   # ", "   # "],
  '5': ["#####", "#    ", "#### ", "    #", "#### "],
  '6': [" ####", "#    ", "#### ", "#   #", " ####"],
  '7': ["#####", "    #", "   # ", "  #  ", " #   "],
  '8': [" ### ", "#   #", " ### ", "#   #", " ### "],
  '9': [" ####", "#   #", " ####", "    #", " ### "],
  ' ': ["     ", "     ", "     ", "     ", "     "],
  '?': [" ### ", "    #", "  ## ", "     ", "  #  "],
  '!': ["  #  ", "  #  ", "  #  ", "     ", "  #  "],
};

export default function AsciiBanner() {
  const [text, setText] = useState('READY');

  const generate = () => {
    if (!text) return '';
    const upper = text.toUpperCase();
    let lines = ['', '', '', '', ''];

    for (let char of upper) {
      const art = FONT_MAP[char] || FONT_MAP['?']; // Use '?' for unknown characters
      for (let i = 0; i < 5; i++) {
        lines[i] += art[i] + '  '; // Add spacing between letters
      }
    }
    return lines.join('\n');
  };

  const output = generate();

  return (
    <div className="p-4 max-w-6xl mx-auto font-sans dark:bg-slate-950 transition-colors">
      <style>
        {`
          :root { --ascii-bg: #ffffff; --ascii-txt: #1a1a1a; --ascii-brd: #ddd; }
          @media (prefers-color-scheme: dark) {
            :root { --ascii-bg: #111827; --ascii-txt: #f3f4f6; --ascii-brd: #374151; }
          }
        `}
      </style>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-center mb-6">
        <div className="w-12 h-12 bg-gray-900 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Type className="w-6 h-6 text-green-400" />
        </div>
        <h2 className="text-xl font-black dark:text-white mb-4 uppercase tracking-tight">ASCII Banner Pro</h2>
        
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 15))} // Limit length so it doesn't break layout
          placeholder="Type something..."
          className="w-full max-w-md p-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:text-white focus:border-green-500 outline-none text-lg text-center font-bold"
        />
      </div>

      {text && (
        <div style={{
          position: 'relative',
          width: '100%',
          minHeight: '400px', // Increased height
          backgroundColor: '#000', // Classic terminal black
          borderRadius: '16px',
          padding: '40px 20px',
          border: '1px solid #333',
          overflowX: 'auto'
        }}>
          <button 
            onClick={() => navigator.clipboard.writeText(output)} 
            className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
            title="Copy to Clipboard"
          >
            <Copy size={18} />
          </button>

          <pre className="text-green-400 font-mono text-[10px] md:text-xs lg:text-sm font-bold leading-none whitespace-pre text-center">
            {output}
          </pre>
        </div>
      )}

      <p className="mt-4 text-[9px] text-center text-gray-400 uppercase font-medium">
        Supports A-Z, 0-9, and Symbols • Pure JS Engine
      </p>
    </div>
  );
}