import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquare, ImageIcon, Video, Trash2, User, Sparkles } from 'lucide-react';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexus_v10');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [mode, setMode] = useState<'chat' | 'image' | 'video'>('chat');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('nexus_v10', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;
    
    const currentPrompt = prompt;
    setMessages(prev => [...prev, { role: 'user', content: currentPrompt, type: 'text' }]);
    setLoading(true);
    setPrompt('');

    try {
      const res = await fetch('/api/agent_9', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt, mode }),
      });
      
      const data = await res.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.error, type: 'text' }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.data || data.text, 
          type: data.type || 'text'
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "The system is currently processing a high volume of requests. Please try again.", type: 'text' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-blue-500/30">
      <div className="flex-grow flex flex-col items-center relative overflow-hidden">
        
        {/* Header */}
        <div className="w-full max-w-5xl p-6 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-2xl z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 animate-pulse">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xs uppercase tracking-[0.2em] text-white/90">Nexus Intelligence</h1>
              <span className="text-[9px] text-blue-500 font-black uppercase">Encrypted Session</span>
            </div>
          </div>
          <button onClick={() => { setMessages([]); localStorage.removeItem('nexus_v10'); }} className="p-3 hover:bg-white/5 rounded-xl text-zinc-600 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>

        {/* Workspace */}
        <div className="w-full max-w-4xl flex-grow overflow-y-auto px-6 py-12 space-y-10 scroll-smooth" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-5 animate-in fade-in slide-in-from-bottom-4 duration-700 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-lg shrink-0 flex items-center justify-center border ${m.role === 'user' ? 'bg-zinc-900 border-white/10' : 'bg-blue-600 text-white border-blue-400/20'}`}>
                {m.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              <div className={`flex-grow max-w-[80%] ${m.role === 'user' ? 'text-right' : ''}`}>
                {m.type === 'image' ? (
                  <img src={m.content} className="rounded-3xl border border-white/10 shadow-2xl w-full hover:scale-[1.02] transition-transform duration-500" alt="Output" />
                ) : m.type === 'video' ? (
                  <video src={m.content} controls autoPlay loop className="rounded-3xl border border-white/10 shadow-2xl w-full" />
                ) : (
                  <div className={`inline-block p-5 rounded-2xl text-[14px] leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white shadow-xl' : 'bg-white/5 text-zinc-300 border border-white/5 backdrop-blur-sm'}`}>
                    {m.content}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-3 text-blue-500 text-[11px] font-bold tracking-widest uppercase pl-14 opacity-80">
              <Loader2 size={14} className="animate-spin"/> 
              Synchronizing...
            </div>
          )}
        </div>

        {/* Input Dock */}
        <div className="w-full max-w-3xl p-8">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-2 shadow-2xl">
            <div className="flex gap-2 mb-2 px-3">
              {['chat', 'image', 'video'].map(t => (
                <button 
                  key={t} 
                  onClick={() => setMode(t as any)} 
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tighter transition-all ${mode === t ? 'bg-white text-black' : 'text-zinc-600 hover:text-white'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 px-4 pb-2">
              <textarea 
                rows={1} 
                value={prompt} 
                onChange={e => setPrompt(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} 
                placeholder="Initialize protocol..." 
                className="flex-grow bg-transparent py-3 outline-none text-sm text-zinc-200 resize-none placeholder-zinc-800" 
              />
              <button onClick={handleSend} disabled={loading} className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-500 transition-transform active:scale-90 disabled:opacity-20">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}