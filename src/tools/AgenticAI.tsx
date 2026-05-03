import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquare, ImageIcon, Video, Code, Trash2, User, Bot, Volume2 } from 'lucide-react';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>(() => {
    const saved = localStorage.getItem('arena_v4_persist');
    return saved ? JSON.parse(saved) : [];
  });
  const [mode, setMode] = useState<'chat' | 'image' | 'video' | 'code'>('chat');
  const [loading, setLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    localStorage.setItem('arena_v4_persist', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;
    const userMsg = { role: 'user', content: prompt, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    const currentInput = prompt;
    setPrompt('');

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentInput, mode }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.text);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.data || data.text, 
        type: data.type || 'text'
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: err.message || "System error. Please try again.",
        type: 'text'
      }]);
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
    <div className="flex h-screen bg-[#070707] text-zinc-100 font-sans selection:bg-blue-500/30">
      <audio ref={audioRef} hidden />
      <div className="flex-grow flex flex-col items-center">
        
        {/* Simple Pro Header */}
        <div className="w-full max-w-5xl p-5 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-black text-xs">A</div>
            <span className="font-bold tracking-tighter text-base uppercase opacity-80">Arena Platform</span>
          </div>
          <button onClick={() => { setMessages([]); localStorage.removeItem('arena_v4_persist'); }} className="p-2 hover:bg-white/5 rounded-full text-zinc-600">
            <Trash2 size={18} />
          </button>
        </div>

        {/* Chat Stream */}
        <div className="w-full max-w-3xl flex-grow overflow-y-auto p-6 space-y-12 scroll-smooth" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className="flex gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center border ${m.role === 'user' ? 'bg-zinc-900 border-white/5' : 'bg-blue-600/10 text-blue-500 border-blue-500/20'}`}>
                {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="flex-grow space-y-2 pt-1">
                <div className="flex items-center gap-3">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{m.role === 'user' ? 'YOU' : 'AI ASSISTANT'}</p>
                  {m.role === 'assistant' && m.type === 'text' && (
                    <button onClick={() => handleTTS(m.content, i)} className="text-zinc-600 hover:text-blue-500 transition-colors">
                      {speakingId === i ? <Loader2 className="animate-spin" size={14} /> : <Volume2 size={14} />}
                    </button>
                  )}
                </div>
                {m.type === 'image' ? (
                  <img src={m.content} className="rounded-2xl border border-white/10 w-full max-w-md shadow-2xl mt-2" alt="Generated" />
                ) : m.type === 'video' ? (
                  <video src={m.content} controls autoPlay loop className="rounded-2xl border border-white/10 w-full max-w-lg shadow-2xl mt-2" />
                ) : (
                  <div className={`text-[15px] leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'bg-zinc-900/40 p-4 rounded-2xl border border-white/5' : 'text-zinc-300'}`}>{m.content}</div>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="flex gap-6 animate-pulse"><div className="w-10 h-10 bg-zinc-900 rounded-2xl" /><div className="h-4 w-40 bg-zinc-900/50 rounded mt-4" /></div>}
        </div>

        {/* Input Bar */}
        <div className="w-full max-w-3xl p-6 pb-12">
          <div className="bg-[#111] border border-white/10 rounded-[28px] p-2 shadow-2xl">
            <div className="flex gap-1 mb-2 px-1">
              {[
                { id: 'chat', icon: <MessageSquare size={13}/>, label: 'Chat' },
                { id: 'image', icon: <ImageIcon size={13}/>, label: 'Image' },
                { id: 'video', icon: <Video size={13}/>, label: 'Video' },
                { id: 'code', icon: <Code size={13}/>, label: 'Code' }
              ].map(t => (
                <button key={t.id} onClick={() => setMode(t.id as any)} className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${mode === t.id ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2 px-3 pb-2">
              <textarea rows={1} value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} placeholder={`Requesting ${mode}...`} className="flex-grow bg-transparent p-2 outline-none text-sm resize-none max-h-40 text-zinc-100 placeholder:text-zinc-700" />
              <button onClick={handleSend} disabled={loading || !prompt.trim()} className="bg-white text-black p-2.5 rounded-full hover:bg-zinc-200 transition-all disabled:opacity-20">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}