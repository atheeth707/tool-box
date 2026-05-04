import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquare, ImageIcon, Video, Trash2, User, Sparkles } from 'lucide-react';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexus_final_v11');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [mode, setMode] = useState<'chat' | 'image' | 'video'>('chat');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('nexus_final_v11', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;
    
    const userInput = prompt;
    setMessages(prev => [...prev, { role: 'user', content: userInput, type: 'text' }]);
    setLoading(true);
    setPrompt('');

    try {
      const res = await fetch('/api/agent_9', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userInput, mode }),
      });
      
      const data = await res.json();
      
      // If the backend sent an error inside the JSON
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
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Network synchronization error. Please check your connection and try again.", 
        type: 'text' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#020202] text-zinc-100 font-sans selection:bg-blue-500/30">
      <div className="flex-grow flex flex-col items-center relative overflow-hidden">
        
        {/* Header */}
        <div className="w-full max-w-5xl p-6 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-3xl z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-[11px] uppercase tracking-[0.3em] text-white/80">Nexus Intelligence</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Protocol v11.0</span>
              </div>
            </div>
          </div>
          <button onClick={() => { setMessages([]); localStorage.removeItem('nexus_final_v11'); }} className="p-3 bg-white/5 hover:bg-red-500/10 rounded-xl text-zinc-600 transition-all hover:text-red-400">
            <Trash2 size={16} />
          </button>
        </div>

        {/* Messaging Area */}
        <div className="w-full max-w-4xl flex-grow overflow-y-auto px-6 py-12 space-y-12" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center border shadow-xl ${m.role === 'user' ? 'bg-zinc-900 border-white/10' : 'bg-blue-600 text-white border-blue-400/20'}`}>
                {m.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
              </div>
              <div className={`flex-grow max-w-[85%] ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                {m.type === 'image' ? (
                  <div className="rounded-[32px] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 transition-transform hover:scale-[1.01]">
                    <img src={m.content} className="w-full h-auto block" alt="AI Generation" />
                  </div>
                ) : m.type === 'video' ? (
                  <div className="rounded-[32px] overflow-hidden border border-white/10 shadow-2xl bg-black">
                    <video src={m.content} controls autoPlay loop className="w-full" />
                  </div>
                ) : (
                  <div className={`inline-block p-6 rounded-[28px] text-[15px] leading-relaxed tracking-wide ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/5 text-zinc-200 border border-white/5 backdrop-blur-xl rounded-tl-none shadow-sm'}`}>
                    {m.content}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-4 text-blue-500 text-[11px] font-black uppercase tracking-[0.2em] pl-16 opacity-70 animate-pulse">
              <Loader2 size={16} className="animate-spin"/> 
              Synthesizing Result...
            </div>
          )}
        </div>

        {/* Input Control */}
        <div className="w-full max-w-4xl p-8">
          <div className="bg-[#0c0c0c] border border-white/10 rounded-[40px] p-2.5 shadow-2xl">
            <div className="flex gap-2 mb-2 px-3">
              {['chat', 'image', 'video'].map(t => (
                <button 
                  key={t} 
                  onClick={() => setMode(t as any)} 
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === t ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/5'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 px-5 pb-3">
              <textarea 
                rows={1} 
                value={prompt} 
                onChange={e => setPrompt(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} 
                placeholder={`Request ${mode} synthesis...`} 
                className="flex-grow bg-transparent py-3 outline-none text-sm text-zinc-100 resize-none placeholder-zinc-800 font-medium" 
              />
              <button 
                onClick={handleSend} 
                disabled={loading || !prompt.trim()}
                className="bg-blue-600 text-white p-4 rounded-3xl hover:bg-blue-500 transition-all active:scale-90 shadow-xl shadow-blue-600/30 disabled:opacity-20"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}