import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquare, ImageIcon, Video, Trash2, User, Zap } from 'lucide-react';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexus_stealth_v1');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [mode, setMode] = useState<'chat' | 'image' | 'video'>('chat');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('nexus_stealth_v1', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;
    
    const currentInput = prompt;
    setMessages(prev => [...prev, { role: 'user', content: currentInput, type: 'text' }]);
    setLoading(true);
    setPrompt('');

    try {
      const res = await fetch('/api/agent_9', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentInput, mode }),
      });
      
      // Safety: check if response is actually JSON before parsing
      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType || !contentType.includes("application/json")) {
        throw new Error("Nexus link timed out. Retrying recommended.");
      }

      const data = await res.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.error || data.data || data.text, 
        type: data.error ? 'text' : (data.type || 'text')
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Protocol interrupted. Please try again.", type: 'text' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#010101] text-zinc-100 font-sans">
      <div className="flex-grow flex flex-col items-center relative overflow-hidden">
        
        {/* Stealth Header */}
        <div className="w-full max-w-5xl p-6 flex justify-between items-center border-b border-white/5 bg-black/80 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
              <Zap size={20} className="text-black fill-black" />
            </div>
            <div>
              <h1 className="font-black text-xs uppercase tracking-[0.4em]">Nexus Core</h1>
              <span className="text-[8px] text-zinc-500 font-bold uppercase">System: Operational</span>
            </div>
          </div>
          <button onClick={() => { setMessages([]); localStorage.removeItem('nexus_stealth_v1'); }} className="p-2 hover:bg-white/5 rounded-lg text-zinc-700 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>

        {/* Clean Output Feed */}
        <div className="w-full max-w-3xl flex-grow overflow-y-auto px-6 py-10 space-y-12 scrollbar-hide" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-grow max-w-[85%] ${m.role === 'user' ? 'text-right' : ''}`}>
                {m.type === 'image' ? (
                  <img src={m.content} className="rounded-2xl border border-white/5 shadow-2xl w-full" alt="Visual" />
                ) : m.type === 'video' ? (
                  <video src={m.content} controls autoPlay loop className="rounded-2xl border border-white/5 shadow-2xl w-full" />
                ) : (
                  <div className={`inline-block p-5 rounded-2xl text-[14px] font-medium leading-relaxed ${m.role === 'user' ? 'bg-zinc-100 text-black' : 'bg-zinc-900/50 text-zinc-300 border border-white/5'}`}>
                    {m.content}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-3 text-zinc-600 text-[10px] font-bold tracking-[0.2em] uppercase pl-2 animate-pulse">
              <Loader2 size={12} className="animate-spin"/> Synchronizing...
            </div>
          )}
        </div>

        {/* Floating Input Dock */}
        <div className="w-full max-w-2xl p-6 mb-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-2 shadow-3xl">
            <div className="flex gap-1 mb-2 px-2">
              {['chat', 'image', 'video'].map(t => (
                <button 
                  key={t} 
                  onClick={() => setMode(t as any)} 
                  className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${mode === t ? 'bg-zinc-100 text-black' : 'text-zinc-600 hover:text-white'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 px-4 pb-2">
              <input 
                value={prompt} 
                onChange={e => setPrompt(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
                placeholder="Type your command..." 
                className="flex-grow bg-transparent py-2 outline-none text-sm text-zinc-200 placeholder-zinc-800" 
              />
              <button onClick={handleSend} disabled={loading} className="bg-white text-black p-3 rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-10">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}