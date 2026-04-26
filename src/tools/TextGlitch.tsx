import { useState } from 'react';
import { Zap, Copy } from 'lucide-react';

export default function TextGlitch() {
  const [text, setText] = useState('ZALGO TEXT');
  const [intensity, setIntensity] = useState(50);

  const glitch = () => {
    if (!text) return '';
    const chars = ['̍','̎','̄','̅','̿','̑','̆','̐','͒','͗','͑','̇','̈','̊','͂','̓','̈','͊','͋','͌','̃','̂','̌','͐','̀','́','̋','̏','̒','̓','̔','̽','̉','ͣ','ͤ','ͥ','ͦ','ͧ','ͨ','ͩ','ͪ','ͫ','ͬ','ͭ','ͮ','ͯ','̾','͛','͆','̚','̕','̛','̀','́','́','̂','̃','̄','̅','̆','̇','̈','̉','̊','̋','̌','̍','̎','̏','̐','̑','̒','̓','̔','̕','̖','̗','̘','̙','̚','̛','̜','̝','̞','̟','̠','̤','̥','̦','̩','̪','̫','̬','̭','̮','̯','̰','̱','̲','̳','̴','̵','̶','̷','̸','̹','̺','̻','̼','̽','̾','̿','̀','́','͂','̓','̈́','ͅ','͆','͇','͈','͉','͊','͋','͌','͍','͎','͏','͐','͑','͒','͓','͔','͕','͖','͗','͘','͙','͚','͛','͜','͝','͞','͟','͠','͡','͢','ͣ','ͤ','ͥ','ͦ','ͧ','ͨ','ͩ','ͪ','ͫ','ͬ','ͭ','ͮ','ͯ'];
    
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += text[i];
      const numGlitches = Math.floor((intensity / 100) * 15);
      for (let j = 0; j < numGlitches; j++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    return result;
  };

  const output = glitch();

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold dark:text-white mb-8">Zalgo Glitch Text Generator</h2>

        <div className="max-w-md mx-auto space-y-6">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type normal text..."
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-black dark:focus:border-white outline-none text-xl text-center font-bold"
          />
          
          <div>
            <div className="flex justify-between text-sm font-bold text-gray-500 mb-2">
              <span>Mild</span>
              <span>Glitch Intensity</span>
              <span>Crazy</span>
            </div>
            <input 
              type="range" min="0" max="100" value={intensity} 
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-black dark:accent-white h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>
      </div>

      {text && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden min-h-[300px] flex items-center justify-center">
          <button onClick={() => navigator.clipboard.writeText(output)} className="absolute top-4 right-4 p-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl shadow-sm transition-colors z-10">
            <Copy size={20} />
          </button>
          <div className="text-3xl md:text-5xl text-gray-900 dark:text-white break-all p-8 leading-loose">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
