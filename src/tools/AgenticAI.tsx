import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquare, ImageIcon, Video, Trash2, User, Sparkles } from 'lucide-react';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexus_final_v1');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [mode, setMode] = useState<'chat' | 'image' | 'video'>('chat');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('nexus_final_v1', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;
    
    const userMessage = { role: 'user', content: prompt, type: 'text' };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setPrompt('');

    try {
      const res = await fetch('/api/agent_9', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage.content, mode }),
      });
      
      // Safety check: Is the response actually JSON?
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("System is momentarily offline. Please try again.");
      }

      const data = await res.json();
      
      if (!res.ok || data.error) {
        throw new Error(data.error || "Generation failed.");
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.data || data.text, 
        type: data.type || 'text'
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: err.message, 
        type: 'text' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-blue-500/30">
      <div className="flex-grow flex flex-col items-center relative overflow-hidden">
        
        {/* Header Section */}
        <div className="w-full max-w-5xl p-6 flex justify-between items-center border-b border-white/5 bg-black/20 backdrop-blur-3xl z-10">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <Sparkles size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm uppercase tracking-widest text-white">Nexus Control</h1>
              <span className="text-[10px] text-blue-400 font-bold uppercase">Multi-Modal Protocol Active</span>
            </div>
          </div>
          <button 
            onClick={() => { setMessages([]); localStorage.removeItem('nexus_final_v1'); }} 
            className="p-3 bg-white/5 hover:bg-red-500/10 rounded-2xl text-zinc-500 transition-all hover:text-red-400 border border-white/5"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Output Feed */}
        <div className="w-full max-w-4xl flex-grow overflow-y-auto px-6 py-10 space-y-10" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center border ${m.role === 'user' ? 'bg-zinc-800 border-white/10' : 'bg-blue-600 text-white border-blue-400/20 shadow-lg shadow-blue-500/20'}`}>
                {m.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
              </div>
              <div className={`flex-grow max-w-[80%] space-y-3 ${m.role === 'user' ? 'text-right' : ''}`}>
                {m.type === 'image' ? (
                  <div className="rounded-[28px] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900">
                    <img src={m.content} className="w-full h-auto block" alt="AI Visual" />
                  </div>
                ) : m.type === 'video' ? (
                  <div className="rounded-[28px] overflow-hidden border border-white/10 shadow-2xl bg-black">
                    <video src={m.content} controls autoPlay loop className="w-full" />
                  </div>
                ) : (
                  <div className={`inline-block p-5 rounded-[24px] text-[15px] leading-relaxed tracking-wide shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/5 text-zinc-200 border border-white/5 rounded-tl-none backdrop-blur-xl'}`}>
                    {m.content}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-4 text-blue-400 text-[13px] font-bold tracking-widest uppercase animate-pulse pl-16">
              <Loader2 size={18} className="animate-spin text-blue-500"/> 
              Processing Request...
            </div>
          )}
        </div>

        {/* Interaction Dock */}
        <div className="w-full max-w-4xl p-8">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-[35px] p-3 shadow-2xl">
            <div className="flex gap-2 mb-3 px-2">
              {[
                { id: 'chat', label: 'Message', icon: <MessageSquare size={13}/> },
                { id: 'image', label: 'Generate Art', icon: <ImageIcon size={13}/> },
                { id: 'video', label: 'Create Motion', icon: <Video size={13}/> }
              ].map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setMode(t.id as any)} 
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all ${mode === t.id ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/5'}`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 px-4 pb-2">
              <textarea 
                rows={1} 
                value={prompt} 
                onChange={e => setPrompt(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} 
                placeholder={`Prompt for ${mode}...`} 
                className="flex-grow bg-transparent py-3 outline-none text-sm text-zinc-100 resize-none placeholder-zinc-800 font-semibold" 
              />
              <button 
                onClick={handleSend} 
                disabled={!prompt.trim() || loading}
                className="bg-blue-600 text-white p-4 rounded-[20px] hover:bg-blue-500 transition-all active:scale-90 shadow-xl shadow-blue-600/30 disabled:opacity-20"
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