import { useState } from 'react';
import { User, Battery, Wifi, Camera, Phone, Video, Info, MoreVertical, Smile, Mic, Image as ImageIcon, ChevronLeft, Search } from 'lucide-react';

type AppType = 'WhatsApp' | 'Instagram' | 'Facebook';

export default function FakeChatGenerator() {
  const [app, setApp] = useState<AppType>('WhatsApp');
  const [name, setName] = useState('John Doe');
  const [messages, setMessages] = useState<{ text: string, isMe: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [isMe, setIsMe] = useState(true);

  const addMsg = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, isMe }]);
    setInput('');
  };

  const theme = {
    WhatsApp: {
      bg: 'bg-[#e5ddd5] dark:bg-[#0b141a] bg-[url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")]',
      header: 'bg-[#075e54] dark:bg-[#202c33] text-white',
      myBubble: 'bg-[#dcf8c6] dark:bg-[#005c4b] text-[#303030] dark:text-white rounded-lg rounded-tr-none relative',
      theirBubble: 'bg-white dark:bg-[#202c33] text-[#303030] dark:text-white rounded-lg rounded-tl-none relative',
      accent: 'bg-[#25d366]'
    },
    Instagram: {
      bg: 'bg-white dark:bg-black',
      header: 'bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 text-black dark:text-white',
      myBubble: 'bg-gradient-to-tr from-[#a832a4] via-[#ed0007] to-[#f2642e] text-white rounded-[22px]',
      theirBubble: 'bg-gray-100 dark:bg-[#262626] text-black dark:text-white rounded-[22px]',
      accent: 'bg-[#3797f0]'
    },
    Facebook: {
      bg: 'bg-white dark:bg-[#18191a]',
      header: 'bg-white dark:bg-[#242526] text-black dark:text-white border-b border-gray-200 dark:border-gray-800',
      myBubble: 'bg-[#0084ff] text-white rounded-[18px]',
      theirBubble: 'bg-[#e4e6eb] dark:bg-[#3e4042] text-black dark:text-white rounded-[18px]',
      accent: 'bg-[#0084ff]'
    }
  }[app];

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-6 font-sans">
      {/* Settings Panel */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 space-y-6 self-start">
        <h2 className="text-2xl font-black tracking-tight dark:text-white">Simulator Engine</h2>
        
        <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl">
          {(['WhatsApp', 'Instagram', 'Facebook'] as AppType[]).map(type => (
            <button key={type} onClick={() => setApp(type)} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${app === type ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-white' : 'text-gray-500'}`}>
              {type}
            </button>
          ))}
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Identity</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-2xl dark:text-white outline-none transition-all font-bold" />
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex space-x-2 mb-4">
            <button onClick={() => setIsMe(false)} className={`flex-1 py-4 rounded-2xl font-bold transition-all ${!isMe ? 'bg-gray-900 text-white' : 'bg-gray-50 dark:bg-gray-900 text-gray-400'}`}>Them</button>
            <button onClick={() => setIsMe(true)} className={`flex-1 py-4 rounded-2xl font-bold transition-all ${isMe ? theme.accent + ' text-white' : 'bg-gray-50 dark:bg-gray-900 text-gray-400'}`}>Me</button>
          </div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type message..." className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-2xl dark:text-white outline-none h-24 mb-4 resize-none" />
          <button onClick={addMsg} className={`w-full py-4 rounded-2xl text-white font-black shadow-lg shadow-blue-500/20 ${theme.accent}`}>Inject Message</button>
          <button onClick={() => setMessages([])} className="w-full mt-6 text-[10px] text-red-500 font-black uppercase tracking-[2px]">Reset Canvas</button>
        </div>
      </div>

      {/* Realistic Device Preview */}
      <div className="flex justify-center items-center">
        <div className="w-[375px] h-[760px] bg-black rounded-[55px] border-[14px] border-gray-900 shadow-[0_40px_100px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden relative">
          
          {/* iOS Status Bar */}
          <div className="h-11 flex justify-between items-end px-8 pb-1 z-20">
            <span className="text-white text-sm font-bold">9:41</span>
            <div className="flex space-x-2 text-white pb-0.5">
              <Wifi size={16} />
              <Battery size={16} />
            </div>
          </div>

          {/* Header UI */}
          <div className={`h-16 flex items-center px-3 justify-between z-10 ${theme.header}`}>
            <div className="flex items-center">
              <ChevronLeft size={24} className="mr-1" />
              <div className="w-9 h-9 rounded-full bg-gray-400 flex items-center justify-center mr-2 overflow-hidden border border-white/10">
                <User size={24} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-[15px]">{name}</div>
                {app === 'WhatsApp' && <div className="text-[11px] opacity-70 leading-none">online</div>}
              </div>
            </div>
            <div className="flex space-x-5 opacity-90 pr-2">
              {app === 'WhatsApp' ? <><Video size={20} /><Phone size={20} /><MoreVertical size={20} /></> :
               app === 'Instagram' ? <><Phone size={22} /><Video size={22} /><Info size={22} /></> :
               <><Phone size={20} /><Video size={20} /><Info size={20} /></>}
            </div>
          </div>

          {/* Chat Engine */}
          <div className={`flex-1 px-3 pt-4 overflow-y-auto space-y-1.5 ${theme.bg} relative`}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'} mb-1`}>
                <div className={`max-w-[72%] px-3.5 py-2 text-[15px] leading-tight shadow-sm ${m.isMe ? theme.myBubble : theme.theirBubble}`}>
                  {m.text}
                  {app === 'WhatsApp' && (
                    <div className="text-[10px] text-right mt-1 opacity-50 flex justify-end items-center space-x-1">
                      <span>9:42 AM</span>
                      {m.isMe && <span className="text-blue-400 font-bold">✓✓</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Platform Specific Input Bar */}
          <div className={`p-2 pb-8 flex items-center space-x-2 ${theme.bg}`}>
            {app === 'WhatsApp' ? (
              <div className="flex-1 flex items-center bg-white dark:bg-[#202c33] rounded-full px-4 py-2 space-x-3">
                <Smile size={22} className="text-gray-400" />
                <div className="flex-1 text-[16px] text-gray-400">Message</div>
                <div className="flex space-x-4 text-gray-400"><ImageIcon size={20}/><Camera size={20}/></div>
              </div>
            ) : app === 'Instagram' ? (
              <div className="flex-1 flex items-center bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-full px-4 py-2.5">
                <div className="bg-blue-500 rounded-full p-1 mr-3"><Camera size={16} className="text-white" /></div>
                <div className="flex-1 text-[15px] text-gray-400">Message...</div>
                <div className="flex space-x-4 text-gray-800 dark:text-white"><Mic size={20}/><ImageIcon size={20}/><Smile size={20}/></div>
              </div>
            ) : (
              <div className="flex-1 flex items-center space-x-3 px-2">
                <MoreVertical className="text-blue-500" />
                <Camera className="text-blue-500" />
                <ImageIcon className="text-blue-500" />
                <Mic className="text-blue-500" />
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 text-gray-400 text-[15px]">Aa</div>
                <Smile className="text-blue-500" />
              </div>
            )}
            {app === 'WhatsApp' && <div className={`${theme.accent} p-3 rounded-full text-white`}><Mic size={22}/></div>}
          </div>
          
          {/* Home Indicator */}
          <div className="absolute bottom-1 w-full flex justify-center pb-2">
            <div className="w-32 h-1.5 bg-gray-600/40 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}