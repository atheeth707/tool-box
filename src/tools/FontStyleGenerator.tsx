import React, { useState } from 'react';
import { Type, Copy, Check } from 'lucide-react';

// Precision Mapping for Unicode Mathematical Alphanumeric Symbols
const MAPS: Record<string, { upper: string; lower: string }> = {
  "Bold": { 
    upper: "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙", 
    lower: "𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳" 
  },
  "Italic": { 
    upper: "𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡", 
    lower: "𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻" 
  },
  "Bold Italic": { 
    upper: "𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕", 
    lower: "𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯" 
  },
  "Script": { 
    upper: "𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵", 
    lower: "𝒶𝓋𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏" 
  },
  "Gothic": { 
    upper: "𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅", 
    lower: "𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟" 
  },
  "Double Struck": { 
    upper: "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ", 
    lower: "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫" 
  },
  "Monospace": { 
    upper: "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉", 
    lower: "𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣" 
  },
  "Bubbles": { 
    upper: "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ", 
    lower: "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ" 
  }
};

const STANDARD_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const STANDARD_LOWER = "abcdefghijklmnopqrstuvwxyz";

export default function FontStyleGenerator() {
  const [text, setText] = useState('Style My Bio');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const convertText = (input: string, fontName: string) => {
    const map = MAPS[fontName];
    return input.split('').map(char => {
      const upperIdx = STANDARD_UPPER.indexOf(char);
      if (upperIdx !== -1) return Array.from(map.upper)[upperIdx];
      
      const lowerIdx = STANDARD_LOWER.indexOf(char);
      if (lowerIdx !== -1) return Array.from(map.lower)[lowerIdx];
      
      return char;
    }).join('');
  };

  const copyToClipboard = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 font-sans">
      {/* Input Section */}
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-xl border border-slate-100 dark:border-slate-800 text-center">
        <div className="w-20 h-20 bg-gradient-to-tr from-fuchsia-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
          <Type className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black dark:text-white mb-2 tracking-tight">Unicode Font Pro</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Instantly transform text for social media bios.</p>

        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something..."
            className="w-full p-6 bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-[24px] dark:text-white focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/10 outline-none text-2xl text-center font-bold transition-all"
          />
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(MAPS).map((fontName) => {
          const transformed = convertText(text || 'Type something', fontName);
          return (
            <div 
              key={fontName} 
              className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center group hover:shadow-md hover:border-fuchsia-200 dark:hover:border-fuchsia-900/50 transition-all"
            >
              <div className="overflow-hidden pr-4">
                <div className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-2">{fontName}</div>
                <div className="text-2xl text-slate-900 dark:text-white truncate font-medium">
                  {transformed}
                </div>
              </div>
              <button 
                onClick={() => copyToClipboard(transformed, fontName)}
                className={`p-4 rounded-2xl transition-all shrink-0 ${
                  copiedId === fontName 
                  ? 'bg-green-500 text-white' 
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-fuchsia-500 hover:text-white'
                }`}
              >
                {copiedId === fontName ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}