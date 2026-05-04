import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Zap, Trash2, ImageIcon, Video, MessageSquare } from 'lucide-react';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [mode, setMode] = useState<'chat' | 'image' | 'video'>('chat');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;
    setMessages(prev => [...prev, { role: 'user', content: prompt, type: 'text' }]);
    setLoading(true);
    setPrompt('');

    try {
      const res = await fetch('/api/agent_9', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.data || data.text || data.error, 
        type: data.type || 'text' 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection failed.", type: 'text' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <div className="flex-grow flex flex-col items-center">
        
        {/* Header */}
        <div className="w-full border-b border-white/10 p-4 flex justify-between items-center bg-zinc-950">
          <div className="flex items-center gap-3">
            <Zap size={18} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Nexus Multi-Tool</span>
          </div>
          <button onClick={() => setMessages([])} className="opacity-20 hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
        </div>

        {/* Chat Feed */}
        <div className="w-full max-w-3xl flex-grow overflow-y-auto p-6 space-y-6" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-white text-black' : 'bg-zinc-900 border border-white/5 text-zinc-300'}`}>
                {m.type === 'image' && <img src={m.content} className="rounded-lg w-full" />}
                {m.type === 'video' && <video src={m.content} controls autoPlay loop className="rounded-lg w-full" />}
                {m.type === 'text' && <p className="text-sm leading-relaxed">{m.content}</p>}
              </div>
            </div>
          ))}
          {loading && <div className="text-[10px] uppercase tracking-widest text-zinc-600 animate-pulse">Processing...</div>}
        </div>

        {/* Input Dock with restored buttons */}
        <div className="w-full max-w-2xl p-6">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-2 shadow-2xl">
            <div className="flex gap-2 mb-2 px-2">
              <button onClick={() => setMode('chat')} className={`p-2 rounded-xl transition-all ${mode === 'chat' ? 'bg-white text-black' : 'text-zinc-500'}`}><MessageSquare size={16}/></button>
              <button onClick={() => setMode('image')} className={`p-2 rounded-xl transition-all ${mode === 'image' ? 'bg-white text-black' : 'text-zinc-500'}`}><ImageIcon size={16}/></button>
              <button onClick={() => setMode('video')} className={`p-2 rounded-xl transition-all ${mode === 'video' ? 'bg-white text-black' : 'text-zinc-500'}`}><Video size={16}/></button>
            </div>
            <div className="flex items-center gap-3 px-4 pb-2">
              <input value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder={`Ask ${mode}...`} className="flex-grow bg-transparent py-2 outline-none text-sm" />
              <button onClick={handleSend} disabled={loading} className="bg-white text-black p-2 rounded-full"><Send size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}