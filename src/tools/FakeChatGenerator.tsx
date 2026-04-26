import { useState } from 'react';
import { MessageCircle, User, Battery, Wifi } from 'lucide-react';

export default function FakeChatGenerator() {
  const [name, setName] = useState('John Doe');
  const [messages, setMessages] = useState([
    { text: 'Hey, are you there?', isMe: false },
    { text: 'Yeah, what\'s up?', isMe: true },
  ]);
  const [input, setInput] = useState('');
  const [isMe, setIsMe] = useState(true);

  const addMsg = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, isMe }]);
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        <h2 className="text-2xl font-bold dark:text-white mb-6">Chat Settings</h2>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Contact Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none font-bold" />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Add Message</label>
          <div className="flex space-x-2 mb-4">
            <button onClick={() => setIsMe(false)} className={`flex-1 py-2 rounded-xl font-bold transition-colors ${!isMe ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'bg-gray-50 dark:bg-gray-900 text-gray-500'}`}>Them</button>
            <button onClick={() => setIsMe(true)} className={`flex-1 py-2 rounded-xl font-bold transition-colors ${isMe ? 'bg-blue-500 text-white' : 'bg-gray-50 dark:bg-gray-900 text-gray-500'}`}>Me</button>
          </div>
          <div className="flex space-x-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addMsg()} placeholder="Type message..." className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none" />
            <button onClick={addMsg} className="px-6 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700">+</button>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800">
        {/* Fake Phone UI */}
        <div className="w-[320px] h-[600px] bg-white dark:bg-gray-950 rounded-[3rem] border-8 border-gray-800 dark:border-gray-700 shadow-2xl flex flex-col overflow-hidden relative">
          {/* Status Bar */}
          <div className="h-7 bg-gray-100 dark:bg-gray-900 flex justify-between items-center px-6 text-[10px] font-bold text-gray-800 dark:text-gray-200">
            <span>9:41</span>
            <div className="flex space-x-1 items-center">
              <Wifi size={10} />
              <Battery size={12} />
            </div>
          </div>
          
          {/* Header */}
          <div className="h-16 bg-gray-100 dark:bg-gray-900 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
              <User size={20} className="text-gray-500" />
            </div>
            <div className="font-bold dark:text-white">{name}</div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white dark:bg-gray-950">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${m.isMe ? 'bg-blue-500 text-white rounded-br-sm' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="h-16 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center px-4">
            <div className="w-full h-10 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 flex items-center px-4 text-gray-400 text-sm">
              Message...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
