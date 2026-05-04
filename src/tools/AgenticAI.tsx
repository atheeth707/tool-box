import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquare, ImageIcon, Video, Trash2, User, Sparkles } from 'lucide-react';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexus_v9');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [mode, setMode] = useState<'chat' | 'image' | 'video'>('chat');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('nexus_v9', JSON.stringify(messages));
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
      
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.data || data.text, 
        type: data.type || 'text'
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: err.message, type: 'text' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#020202] text-zinc-100 font-sans selection:bg-blue-500/30">
      <div className="flex-grow flex flex-col items-center relative overflow-hidden">
        {/* Aesthetic Glow */}
        <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        {/* Header */}
        <div className="w-full max-w-5xl p-6 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm uppercase tracking-tighter">Nexus Intelligence</h1>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-zinc-500 font-medium">Core Systems Active</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => { setMessages([]); localStorage.removeItem('nexus_v9'); }} 
            className="p-3 hover:bg-white/5 rounded-2xl text-zinc-600 transition-all hover:text-white border border-transparent hover:border-white/10"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Cinematic Workspace */}
        <div className="w-full max-w-4xl flex-grow overflow-y-auto px-6 py-12 space-y-12 scrollbar-hide" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center border shadow-xl ${m.role === 'user' ? 'bg-zinc-900 border-white/10' : 'bg-blue-600 text-white border-blue-400/20'}`}>
                {m.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
              </div>
              <div className={`flex-grow max-w-2xl space-y-3 ${m.role === 'user' ? 'text-right' : ''}`}>
                {m.type === 'image' ? (
                  <div className="rounded-[32px] overflow-hidden border border-white/10 shadow-2xl transition-transform hover:scale-[1.01] duration-500">
                    <img src={m.content} className="w-full h-auto" alt="Visual Output" />
                  </div>
                ) : m.type === 'video' ? (
                  <div className="rounded-[32px] overflow-hidden border border-white/10 shadow-2xl bg-black">
                    <video src={m.content} controls autoPlay loop playsInline className="w-full" />
                  </div>
                ) : (
                  <div className={`inline-block p-5 rounded-[24px] text-[15px] leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-zinc-900/50 text-zinc-200 border border-white/5 rounded-tl-none backdrop-blur-md'}`}>
                    {m.content}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-4 text-blue-500 text-sm font-semibold animate-pulse pl-16">
              <Loader2 size={18} className="animate-spin"/> 
              Synthesizing response...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="w-full max-w-4xl p-8">
          <div className="bg-[#0c0c0c] border border-white/10 rounded-[32px] p-2 shadow-2xl backdrop-blur-2xl">
            <div className="flex gap-2 mb-2 px-2">
              {[
                { id: 'chat', icon: <MessageSquare size={14}/> },
                { id: 'image', icon: <ImageIcon size={14}/> },
                { id: 'video', icon: <Video size={14}/> }
              ].map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setMode(t.id as any)} 
                  className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${mode === t.id ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/5'}`}
                >
                  {t.icon} {t.id}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 px-4 pb-2">
              <textarea 
                rows={1} 
                value={prompt} 
                onChange={e => setPrompt(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} 
                placeholder={`Describe your vision for ${mode}...`} 
                className="flex-grow bg-transparent py-3 outline-none text-sm text-zinc-100 resize-none placeholder-zinc-800 font-medium" 
              />
              <button onClick={handleSend} className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-500 transition-all active:scale-90 shadow-lg shadow-blue-600/20">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}