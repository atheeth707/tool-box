import { useState } from 'react';
import { Type, Copy } from 'lucide-react';

const FONTS = [
  { name: 'Math Bold', map: '𝗮𝗯ｃ𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭' },
  { name: 'Math Italic', map: '𝘢𝗯𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡' },
  { name: 'Script', map: '𝒶𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝒜𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡' }, // Simplified for brevity
  { name: 'Gothic', map: '𝖆𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝕬𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡' },
  { name: 'Double Struck', map: '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ' },
  { name: 'Circled', map: 'ⓐ𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫Ⓐ𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ' },
  { name: 'Squared', map: '🄰𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫🅰𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ' }
];

export default function FontStyleGenerator() {
  const [text, setText] = useState('Hello World');

  // Simple mapping approach (real implementation would map char codes)
  // For this demo, we'll use a simplified generative approach for the fonts
  const generateFonts = () => {
    if (!text) return [];
    
    return [
      { name: 'Bold', val: text.split('').map(c => c.match(/[a-zA-Z]/) ? String.fromCodePoint(c.charCodeAt(0) + (c >= 'a' ? 119793 : 119743)) : c).join('') },
      { name: 'Italic', val: text.split('').map(c => c.match(/[a-zA-Z]/) ? String.fromCodePoint(c.charCodeAt(0) + (c >= 'a' ? 119845 : 119795)) : c).join('') },
      { name: 'Double Struck', val: text.split('').map(c => c.match(/[a-zA-Z]/) ? String.fromCodePoint(c.charCodeAt(0) + (c >= 'a' ? 120049 : 119999)) : c).join('') },
      { name: 'Cursive', val: text.split('').map(c => c.match(/[a-zA-Z]/) ? String.fromCodePoint(c.charCodeAt(0) + (c >= 'a' ? 119951 : 119899)) : c).join('') },
      { name: 'Gothic', val: text.split('').map(c => c.match(/[a-zA-Z]/) ? String.fromCodePoint(c.charCodeAt(0) + (c >= 'a' ? 120153 : 120103)) : c).join('') },
      { name: 'Monospace', val: text.split('').map(c => c.match(/[a-zA-Z]/) ? String.fromCodePoint(c.charCodeAt(0) + (c >= 'a' ? 120355 : 120305)) : c).join('') },
    ];
  };

  const fonts = generateFonts();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <div className="w-16 h-16 bg-fuchsia-50 dark:bg-fuchsia-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Type className="w-8 h-8 text-fuchsia-600 dark:text-fuchsia-400" />
        </div>
        <h2 className="text-2xl font-bold dark:text-white mb-2">Font Style Generator</h2>
        <p className="text-gray-500 mb-8">Convert normal text into cool Unicode fonts for Instagram, Twitter, and TikTok bios.</p>

        <div className="max-w-xl mx-auto">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your text here..."
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-fuchsia-500 outline-none text-xl text-center font-bold"
          />
        </div>
      </div>

      {text && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fonts.map((f, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center group hover:border-fuchsia-300 transition-colors">
              <div className="overflow-hidden pr-4">
                <div className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">{f.name}</div>
                <div className="text-2xl text-gray-900 dark:text-white truncate">{f.val}</div>
              </div>
              <button onClick={() => navigator.clipboard.writeText(f.val)} className="p-3 bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 rounded-xl hover:bg-fuchsia-100 transition-colors shrink-0">
                <Copy size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
