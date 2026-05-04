import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquare, ImageIcon, Video, Trash2, User, Sparkles } from 'lucide-react';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arena_v6_data');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [mode, setMode] = useState<'chat' | 'image' | 'video'>('chat');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('arena_v6_data', JSON.stringify(messages));
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
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Error: ${err.message}`, type: 'text' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-900/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="flex-grow flex flex-col items-center relative z-10 w-full">
        
        {/* Sleek Header */}
        <div className="w-full max-w-5xl p-5 flex justify-between items-center border-b border-white/5 bg-black/20 backdrop-blur-3xl shadow-sm z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-sm uppercase text-white drop-shadow-md">Nexus Studio</span>
              <p className="text-[10px] text-zinc-400 font-medium">Unified AI Engine</p>
            </div>
          </div>
          <button 
            onClick={() => { setMessages([]); localStorage.removeItem('arena_v6_data'); }} 
            className="p-2.5 bg-white/5 hover:bg-red-500/20 rounded-full text-zinc-400 hover:text-red-400 transition-all duration-300 backdrop-blur-md"
            title="Clear Chat"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Cinematic Chat Feed */}
        <div className="w-full max-w-4xl flex-grow overflow-y-auto px-4 py-8 space-y-8 scroll-smooth" ref={scrollRef}>
          {messages.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4 opacity-60">
              <Sparkles size={48} className="text-zinc-700" />
              <p className="text-sm">What would you like to create today?</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role !== 'user' && (
                <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center bg-gradient-to-tr from-blue-900/40 to-purple-900/40 border border-white/10 shadow-lg mt-1">
                  <Sparkles size={16} className="text-blue-400" />
                </div>
              )}
              
              <div className={`max-w-[85%] space-y-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                {m.type === 'image' ? (
                  <div className="relative group p-1 bg-white/5 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm transition-all hover:bg-white/10">
                    <img src={m.content} className="rounded-[22px] w-full object-cover max-h-[500px]" alt="AI Art" />
                  </div>
                ) : m.type === 'video' ? (
                  <div className="relative group p-1 bg-white/5 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm transition-all hover:bg-white/10">
                    <video src={m.content} controls autoPlay loop muted playsInline className="rounded-[22px] w-full max-h-[500px] bg-black/50" />
                  </div>
                ) : (
                  <div className={`px-5 py-3.5 rounded-3xl leading-relaxed text-[15px] shadow-sm
                    ${m.role === 'user' 
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm' 
                      : 'bg-white/5 text-zinc-200 border border-white/10 rounded-tl-sm'
                    }
                    ${m.content.includes('❌ Error') ? 'bg-red-500/10 border-red-500/20 text-red-400' : ''}
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
          
          {/* Custom Loading State */}
          {loading && (
            <div className="flex items-center gap-3 text-blue-400 text-sm font-medium animate-pulse pl-12 bg-blue-900/10 w-max px-5 py-3 rounded-2xl border border-blue-500/20 shadow-lg">
              <Loader2 size={16} className="animate-spin"/> 
              Synthesizing {mode}... {(mode === 'video' || mode === 'image') && 'This may take up to 30s.'}
            </div>
          )}
        </div>

        {/* Floating Input Dock */}
        <div className="w-full max-w-4xl p-6 relative z-20">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-3 shadow-2xl shadow-black">
            
            {/* Mode Selector */}
            <div className="flex gap-2 mb-3 px-1">
              {[
                { id: 'chat', icon: <MessageSquare size={14}/>, label: 'Chat' },
                { id: 'image', icon: <ImageIcon size={14}/>, label: 'Image' },
                { id: 'video', icon: <Video size={14}/>, label: 'Video' }
              ].map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setMode(t.id as any)} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300
                    ${mode === t.id 
                      ? 'bg-white/10 text-white shadow-inner border border-white/10' 
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                    }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            
            {/* Input Area */}
            <div className="flex items-end gap-3 bg-white/5 rounded-2xl p-2 border border-white/5 focus-within:border-white/20 focus-within:bg-white/10 transition-all duration-300">
              <textarea 
                rows={1} 
                value={prompt} 
                onChange={e => setPrompt(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} 
                placeholder={`Envision something in ${mode} mode...`} 
                className="flex-grow bg-transparent p-3 outline-none text-[15px] text-zinc-100 resize-none placeholder-zinc-600 font-medium" 
                style={{ minHeight: '52px', maxHeight: '150px' }}
              />
              <button 
                onClick={handleSend} 
                disabled={!prompt.trim() || loading}
                className="bg-white text-black p-4 rounded-xl hover:bg-blue-100 disabled:opacity-50 disabled:hover:bg-white transition-all duration-300 active:scale-95 shadow-md flex-shrink-0"
              >
                <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}