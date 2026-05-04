import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquare, ImageIcon, Video, Trash2, User, Sparkles, AlertCircle } from 'lucide-react';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arena_v7_data');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [mode, setMode] = useState<'chat' | 'image' | 'video'>('chat');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('arena_v7_data', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;
    const currentInput = prompt;
    setMessages(prev => [...prev, { role: 'user', content: currentInput, type: 'text' }]);
    setLoading(true);
    setPrompt('');

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentInput, mode }),
      });
      
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Generation Failed");
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.data || data.text, 
        type: data.type || 'text'
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: err.message, type: 'error' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Cinematic Ambient Background */}
      <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-1/4 w-[600px] h-[600px] bg-indigo-900/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="flex-grow flex flex-col items-center relative z-10 w-full">
        
        {/* Top Navigation */}
        <div className="w-full max-w-5xl p-5 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-2xl shadow-sm z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-cyan-500/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-sm uppercase text-white drop-shadow-md">Nexus Studio</span>
              <p className="text-[10px] text-cyan-400/80 font-medium tracking-wide">Unified Creative Engine</p>
            </div>
          </div>
          <button 
            onClick={() => { setMessages([]); localStorage.removeItem('arena_v7_data'); }} 
            className="p-2.5 bg-white/5 hover:bg-red-500/20 rounded-full text-zinc-400 hover:text-red-400 transition-all duration-300 backdrop-blur-md border border-white/5"
            title="Clear Workspace"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Chat / Media Feed */}
        <div className="w-full max-w-4xl flex-grow overflow-y-auto px-4 py-8 space-y-8 scroll-smooth" ref={scrollRef}>
          {messages.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4 opacity-60">
              <Sparkles size={56} className="text-zinc-700" />
              <p className="text-sm font-medium tracking-wide">Select a mode below to begin generating.</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role !== 'user' && (
                <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center bg-gradient-to-tr from-cyan-900/40 to-blue-900/40 border border-cyan-500/20 shadow-lg mt-1">
                  <Sparkles size={16} className="text-cyan-400" />
                </div>
              )}
              
              <div className={`max-w-[85%] space-y-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                {m.type === 'image' ? (
                  <div className="relative group p-1.5 bg-white/5 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm transition-all hover:bg-white/10">
                    <img src={m.content} className="rounded-[20px] w-full object-cover max-h-[500px]" alt="Generated Art" />
                  </div>
                ) : m.type === 'video' ? (
                  <div className="relative group p-1.5 bg-white/5 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm transition-all hover:bg-white/10">
                    <video src={m.content} controls autoPlay loop muted playsInline className="rounded-[20px] w-full max-h-[500px] bg-black/80" />
                  </div>
                ) : m.type === 'error' ? (
                  <div className="px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-3 shadow-sm backdrop-blur-sm">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <p className="text-[14px] leading-relaxed font-medium">{m.content}</p>
                  </div>
                ) : (
                  <div className={`px-5 py-3.5 rounded-3xl leading-relaxed text-[15px] shadow-sm
                    ${m.role === 'user' 
                      ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-br-sm' 
                      : 'bg-white/5 text-zinc-200 border border-white/10 rounded-tl-sm backdrop-blur-sm'
                    }
                  `}>
                    {m.content}
                  </div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center bg-zinc-800 border border-white/10 shadow-lg mt-1">
                  <User size={16} className="text-zinc-400" />
                </div>
              )}
            </div>
          ))}
          
          {/* Detailed Loading Indicator */}
          {loading && (
            <div className="flex items-center gap-3 text-cyan-400 text-sm font-medium animate-pulse pl-12 bg-cyan-900/10 w-max px-5 py-3 rounded-2xl border border-cyan-500/20 shadow-lg backdrop-blur-sm">
              <Loader2 size={16} className="animate-spin"/> 
              {mode === 'chat' 
                ? 'Thinking...' 
                : `Booting Hugging Face Model for ${mode}... (May take up to 60s)`}
            </div>
          )}
        </div>

        {/* Input Dock */}
        <div className="w-full max-w-4xl p-6 relative z-20">
          <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-3 shadow-2xl shadow-black/50">
            
            {/* Mode Toggles */}
            <div className="flex gap-2 mb-3 px-1">
              {[
                { id: 'chat', icon: <MessageSquare size={14}/>, label: 'Gemini Chat' },
                { id: 'image', icon: <ImageIcon size={14}/>, label: 'HF Image' },
                { id: 'video', icon: <Video size={14}/>, label: 'HF Video' }
              ].map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setMode(t.id as any)} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300
                    ${mode === t.id 
                      ? 'bg-cyan-500/20 text-cyan-300 shadow-inner border border-cyan-500/30' 
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'
                    }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            
            {/* Textarea */}
            <div className="flex items-end gap-3 bg-white/5 rounded-2xl p-2 border border-white/5 focus-within:border-cyan-500/30 focus-within:bg-white/10 transition-all duration-300">
              <textarea 
                rows={1} 
                value={prompt} 
                onChange={e => setPrompt(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} 
                placeholder={`Type a prompt for ${mode} generation...`} 
                className="flex-grow bg-transparent p-3 outline-none text-[15px] text-zinc-100 resize-none placeholder-zinc-600 font-medium" 
                style={{ minHeight: '52px', maxHeight: '150px' }}
              />
              <button 
                onClick={handleSend} 
                disabled={!prompt.trim() || loading}
                className="bg-white text-black p-4 rounded-xl hover:bg-cyan-100 disabled:opacity-50 disabled:hover:bg-white transition-all duration-300 active:scale-95 shadow-md flex-shrink-0 group"
              >
                <Send size={18} className="translate-x-[-1px] translate-y-[1px] group-hover:text-cyan-600 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}