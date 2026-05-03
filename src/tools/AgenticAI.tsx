import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquare, ImageIcon, Video, Code, Trash2, User, Bot, Volume2 } from 'lucide-react';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>(() => {
    const saved = localStorage.getItem('arena_chat_persist');
    return saved ? JSON.parse(saved) : [];
  });
  const [mode, setMode] = useState<'chat' | 'image' | 'video' | 'code'>('chat');
  const [loading, setLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    localStorage.setItem('arena_chat_persist', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;
    const userMsg = { role: 'user', content: prompt, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    const text = prompt;
    setPrompt('');

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, mode }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.data || data.text, 
        type: data.type || 'text'
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "System failed to respond." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleTTS = async (text: string, index: number) => {
    setSpeakingId(index);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textToSpeak: text }),
      });
      const data = await res.json();
      if (data.data && audioRef.current) {
        audioRef.current.src = data.data;
        audioRef.current.play();
      }
    } finally { setSpeakingId(null); }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-zinc-100">
      <audio ref={audioRef} hidden />
      <div className="flex-grow flex flex-col items-center">
        
        {/* Simple Header */}
        <div className="w-full max-w-5xl p-5 flex justify-between items-center border-b border-white/5 bg-black/50 backdrop-blur-lg">
          <span className="font-black tracking-tighter text-xl">ARENA <span className="text-blue-500">AI</span></span>
          <button onClick={() => { setMessages([]); localStorage.removeItem('arena_chat_persist'); }} className="p-2 hover:bg-white/5 rounded-full text-zinc-500">
            <Trash2 size={20} />
          </button>
        </div>

        {/* Message Stream */}
        <div className="w-full max-w-3xl flex-grow overflow-y-auto p-6 space-y-10" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className="flex gap-6 animate-in fade-in slide-in-from-bottom-2">
              <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center border ${m.role === 'user' ? 'bg-zinc-800' : 'bg-blue-600/10 text-blue-500 border-blue-500/20'}`}>
                {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="flex-grow space-y-2 pt-1">
                <div className="flex items-center gap-3">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">{m.role === 'user' ? 'USER' : 'AI ASSISTANT'}</p>
                  {m.role === 'assistant' && m.type === 'text' && (
                    <button onClick={() => handleTTS(m.content, i)} className="text-zinc-600 hover:text-blue-500">
                      {speakingId === i ? <Loader2 className="animate-spin" size={14} /> : <Volume2 size={14} />}
                    </button>
                  )}
                </div>
                {m.type === 'image' ? (
                  <img src={m.content} className="rounded-2xl border border-white/10 w-full max-w-md shadow-2xl" alt="AI" />
                ) : m.type === 'video' ? (
                  <video src={m.content} controls autoPlay loop className="rounded-2xl border border-white/10 w-full max-w-lg shadow-2xl" />
                ) : (
                  <div className={`text-[16px] leading-relaxed ${m.role === 'user' ? 'bg-white/5 p-4 rounded-2xl border border-white/5' : 'text-zinc-300'}`}>{m.content}</div>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="flex gap-6 animate-pulse"><div className="w-10 h-10 bg-zinc-900 rounded-2xl" /><div className="h-4 w-full bg-zinc-900/50 rounded mt-4" /></div>}
        </div>

        {/* Input Control Center */}
        <div className="w-full max-w-3xl p-6 pb-10">
          <div className="bg-[#141414] border border-white/10 rounded-[32px] p-3 shadow-2xl transition-all">
            <div className="flex gap-2 mb-3 px-2">
              {[
                { id: 'chat', icon: <MessageSquare size={14}/>, label: 'Chat' },
                { id: 'image', icon: <ImageIcon size={14}/>, label: 'Image' },
                { id: 'video', icon: <Video size={14}/>, label: 'Video' },
                { id: 'code', icon: <Code size={14}/>, label: 'Code' }
              ].map(t => (
                <button key={t.id} onClick={() => setMode(t.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${mode === t.id ? 'bg-white/10 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-3 px-3">
              <textarea rows={1} value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} placeholder={`Type your request...`} className="flex-grow bg-transparent p-2 outline-none text-base resize-none max-h-40 text-zinc-100" />
              <button onClick={handleSend} disabled={loading || !prompt.trim()} className="bg-white text-black p-3 rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-10 shadow-lg">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}