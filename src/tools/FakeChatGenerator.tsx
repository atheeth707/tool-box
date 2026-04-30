import { useState } from 'react';
import { User, Battery, Wifi, Camera, Phone, Video, Info, MoreVertical, Smile, Mic, Image as ImageIcon } from 'lucide-react';

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

  // Styles Mapping
  const theme = {
    WhatsApp: {
      bg: 'bg-[#e5ddd5] dark:bg-[#0b141a]',
      header: 'bg-[#075e54] text-white',
      myBubble: 'bg-[#dcf8c6] dark:bg-[#005c4b] text-gray-800 dark:text-white rounded-tr-none shadow-sm',
      theirBubble: 'bg-white dark:bg-[#202c33] text-gray-800 dark:text-white rounded-tl-none shadow-sm',
      accent: 'bg-[#25d366]'
    },
    Instagram: {
      bg: 'bg-white dark:bg-black',
      header: 'bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 text-black dark:text-white',
      myBubble: 'bg-[#3797f0] text-white rounded-2xl',
      theirBubble: 'bg-gray-100 dark:bg-[#262626] text-black dark:text-white rounded-2xl',
      accent: 'bg-[#3797f0]'
    },
    Facebook: {
      bg: 'bg-white dark:bg-[#18191a]',
      header: 'bg-white dark:bg-[#242526] text-black dark:text-white border-b border-gray-200 dark:border-gray-800',
      myBubble: 'bg-[#0084ff] text-white rounded-2xl',
      theirBubble: 'bg-[#e4e6eb] dark:bg-[#3e4042] text-black dark:text-white rounded-2xl',
      accent: 'bg-[#0084ff]'
    }
  }[app];

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
      {/* Settings Panel */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 space-y-6">
        <h2 className="text-2xl font-bold dark:text-white">Chat Customizer</h2>
        
        <div className="grid grid-cols-3 gap-2">
          {(['WhatsApp', 'Instagram', 'Facebook'] as AppType[]).map(type => (
            <button key={type} onClick={() => setApp(type)} className={`py-2 rounded-xl text-xs font-bold transition-all ${app === type ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-900 dark:text-gray-400'}`}>
              {type}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Contact Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-2xl dark:text-white outline-none transition-all" />
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex space-x-2 mb-4">
            <button onClick={() => setIsMe(false)} className={`flex-1 py-3 rounded-xl font-bold ${!isMe ? 'bg-gray-800 text-white' : 'bg-gray-100 dark:bg-gray-900 text-gray-400'}`}>Them</button>
            <button onClick={() => setIsMe(true)} className={`flex-1 py-3 rounded-xl font-bold ${isMe ? theme.accent + ' text-white' : 'bg-gray-100 dark:bg-gray-900 text-gray-400'}`}>Me</button>
          </div>
          <div className="flex space-x-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addMsg()} placeholder="Type a message..." className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-2xl dark:text-white outline-none" />
            <button onClick={addMsg} className={`px-6 rounded-2xl text-white font-bold ${theme.accent}`}>Add</button>
          </div>
          <button onClick={() => setMessages([])} className="w-full mt-4 text-xs text-red-500 font-bold uppercase tracking-wider">Clear Chat History</button>
        </div>
      </div>

      {/* Phone Preview */}
      <div className="flex justify-center items-center">
        <div className="w-[340px] h-[680px] bg-black rounded-[3.5rem] border-[12px] border-gray-900 shadow-[0_0_50px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden relative">
          
          {/* Notch / Status Bar */}
          <div className="h-10 bg-inherit flex justify-between items-center px-8 pt-4 z-10">
            <span className="text-white text-xs font-bold">9:41</span>
            <div className="flex space-x-2 text-white">
              <Wifi size={14} />
              <Battery size={14} />
            </div>
          </div>

          {/* Dynamic Header */}
          <div className={`h-16 flex items-center px-4 justify-between ${theme.header}`}>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center mr-3 overflow-hidden">
                <User size={24} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-sm leading-tight">{name}</div>
                {app === 'WhatsApp' && <div className="text-[10px] opacity-80">online</div>}
              </div>
            </div>
            <div className="flex space-x-4 opacity-80">
              {app === 'WhatsApp' ? <><Video size={18} /><Phone size={18} /><MoreVertical size={18} /></> :
               app === 'Instagram' ? <><Phone size={20} /><Video size={20} /><Info size={20} /></> :
               <><Phone size={18} /><Video size={18} /><Info size={18} /></>}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 p-4 overflow-y-auto space-y-2 ${theme.bg}`}>
            {messages.length === 0 && (
              <div className="text-center text-[10px] text-gray-500 mt-10 uppercase tracking-widest">No messages yet</div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2 text-sm shadow-sm ${m.isMe ? theme.myBubble : theme.theirBubble}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Input Area */}
          <div className={`p-3 flex items-center space-x-2 ${theme.bg} border-t border-black/5`}>
            {app === 'WhatsApp' ? (
              <div className="flex-1 flex items-center bg-white dark:bg-[#202c33] rounded-full px-3 py-2 space-x-2 shadow-sm">
                <Smile size={20} className="text-gray-400" />
                <div className="flex-1 text-xs text-gray-400">Message</div>
                <div className="flex space-x-2 text-gray-400"><ImageIcon size={18}/><Camera size={18}/></div>
              </div>
            ) : (
              <div className="flex-1 flex items-center bg-gray-100 dark:bg-[#262626] rounded-full px-4 py-2 border dark:border-gray-800">
                <div className="flex-1 text-xs text-gray-400">Message...</div>
                <div className="flex space-x-3 text-gray-500"><Mic size={18}/><ImageIcon size={18}/></div>
              </div>
            )}
            {app === 'WhatsApp' && <div className={`${theme.accent} p-2 rounded-full text-white`}><Mic size={20}/></div>}
          </div>
          
          <div className="h-6 bg-inherit flex justify-center items-end pb-2">
            <div className="w-28 h-1 bg-gray-500/50 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}