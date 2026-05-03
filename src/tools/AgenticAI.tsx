import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquare, Video, Code, Trash2, User, Bot, Sparkles, Volume2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>(() => {
    const saved = localStorage.getItem('arena_v3_session');
    return saved ? JSON.parse(saved) : [];
  });
  const [mode, setMode] = useState<'chat' | 'video' | 'code'>('chat');
  const [loading, setLoading] = useState(false);
  const [ttsId, setTtsId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    localStorage.setItem('arena_v3_session', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleAction = async () => {
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
        type: data.type || 'text',
        engine: data.engine 
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: "API Error." }]);
    } finally {
      setLoading(false);
    }
  };

  const playTTS = async (text: string, id: string) => {
    setTtsId(id);
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
    } finally { setTtsId(null); }
  };

  return (
    <div className="flex h-screen bg-[#080808] text-zinc-200">
      <audio ref={audioRef} hidden />
      <div className="flex-grow flex flex-col items-center overflow-hidden">
        
        {/* Header */}
        <div className="w-full max-w-5xl p-4 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white">A</div>
            <span className="font-bold tracking-tight text-white uppercase text-xs">Arena AI Core</span>
          </div>
          <button onClick={() => { setMessages([]); localStorage.removeItem('arena_v3_session'); }} className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 transition-all">
            <Trash2 size={18} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="w-full max-w-3xl flex-grow overflow-y-auto px-6 py-10 space-y-10" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className="flex gap-6 animate-in fade-in slide-in-from-bottom-2">
              <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center border ${m.role === 'user' ? 'bg-zinc-800' : 'bg-blue-600/10 text-blue-500 border-blue-500/20'}`}>
                {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className="flex-grow space-y-2 pt-1">
                <div className="flex items-center gap-3">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{m.role === 'user' ? 'You' : m.engine}</p>
                  {m.role === 'assistant' && m.type === 'text' && (
                    <button onClick={() => playTTS(m.content, `t-${i}`)} className="text-zinc-600 hover:text-blue-500">
                      {ttsId === `t-${i}` ? <Loader2 className="animate-spin" size={14} /> : <Volume2 size={14} />}
                    </button>
                  )}
                </div>
                {m.type === 'video' ? (
                  <video src={m.content} controls autoPlay loop className="rounded-2xl border border-white/10 w-full shadow-2xl" />
                ) : (
                  <div className={`text-[15px] leading-relaxed ${m.role === 'user' ? 'text-zinc-100 bg-white/5 p-4 rounded-2xl border border-white/5' : 'text-zinc-300'}`}>{m.content}</div>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="flex gap-6 animate-pulse"><div className="w-9 h-9 bg-zinc-900 rounded-xl" /><div className="h-4 w-full bg-zinc-900/50 rounded mt-3" /></div>}
        </div>

        {/* Floating Input */}
        <div className="w-full max-w-3xl p-6">
          <div className="bg-[#111] border border-white/10 rounded-[28px] p-2 shadow-2xl focus-within:border-white/20 transition-all backdrop-blur-2xl">
            <div className="flex gap-2 mb-2 px-2">
              {[
                { id: 'chat', icon: <MessageSquare size={13}/>, label: 'Gemini Chat' },
                { id: 'code', icon: <Code size={13}/>, label: 'Llama 3.3 70B' },
                { id: 'video', icon: <Video size={13}/>, label: 'Wan 2.2' }
              ].map(t => (
                <button key={t.id} onClick={() => setMode(t.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${mode === t.id ? 'bg-white/10 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2 px-3 pb-1">
              <textarea rows={1} value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAction())} placeholder={`Ask anything in ${mode} mode...`} className="flex-grow bg-transparent p-2.5 outline-none text-base resize-none max-h-40 text-zinc-100" />
              <button onClick={handleAction} disabled={loading || !prompt.trim()} className="bg-zinc-100 text-black p-3 rounded-full hover:bg-white transition-all disabled:opacity-10 shadow-lg">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}