import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquare, ImageIcon, Video, Code, Trash2, User, Bot, Sparkles } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>(() => {
    const saved = localStorage.getItem('arena_current_chat');
    return saved ? JSON.parse(saved) : [];
  });
  const [mode, setMode] = useState<'chat' | 'image' | 'video' | 'code'>('chat');
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync to Local Storage
  useEffect(() => {
    localStorage.setItem('arena_current_chat', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  // Fetch User Credits
  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('credits').eq('id', session.user.id).single();
        if (data) setCredits(data.credits);
      }
    };
    loadUser();
  }, [loading]);

  const handleAction = async () => {
    if (!prompt.trim() || loading || credits < 1) return;
    
    const userMsg = { role: 'user', content: prompt, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    const userPrompt = prompt;
    setPrompt('');

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt, mode }),
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.data || data.text, 
        type: data.type || 'text',
        engine: data.engine 
      }]);

      // Simple credit deduction
      await supabase.from('profiles').update({ credits: credits - 1 }).eq('id', (await supabase.auth.getUser()).data.user?.id);

    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}`, type: 'text' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-blue-500/30">
      <div className="flex-grow flex flex-col items-center">
        
        {/* Top Header */}
        <div className="w-full max-w-5xl p-4 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles size={16} className="text-white fill-white" />
            </div>
            <span className="font-black text-sm tracking-widest uppercase italic">Arena Core</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold bg-zinc-900 px-3 py-1.5 rounded-full border border-white/10 text-zinc-400">
              {credits} CREDITS
            </span>
            <button onClick={() => { setMessages([]); localStorage.removeItem('arena_current_chat'); }} className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-all rounded-lg">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Chat Stream */}
        <div className="w-full max-w-3xl flex-grow overflow-y-auto px-6 py-10 space-y-12" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
              <Bot size={64} strokeWidth={1} />
              <h2 className="mt-4 text-2xl font-light">What are we building today?</h2>
              <p className="text-xs mt-2 font-mono uppercase tracking-widest">Llama 3.1 & Gemini Cluster Active</p>
            </div>
          )}
          
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-6 ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`flex gap-5 max-w-[90%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center border ${m.role === 'user' ? 'bg-zinc-800 border-white/10 shadow-xl' : 'bg-blue-600/10 text-blue-500 border-blue-500/20 shadow-lg shadow-blue-500/5'}`}>
                  {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className="flex-grow space-y-2 pt-1">
                  <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${m.role === 'user' ? 'text-right text-zinc-600' : 'text-zinc-500'}`}>
                    {m.role === 'user' ? 'User' : m.engine}
                  </p>
                  {m.type === 'image' ? (
                    <img src={m.content} className="rounded-2xl border border-white/5 shadow-2xl mt-2 ring-1 ring-white/10" alt="Generated" />
                  ) : (
                    <div className={`text-[15px] leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'text-zinc-100 bg-white/5 p-4 rounded-2xl border border-white/5' : 'text-zinc-300'}`}>
                      {m.content}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-6">
              <div className="w-9 h-9 bg-zinc-900 rounded-xl border border-white/5 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={16} />
              </div>
              <div className="space-y-2 pt-1 flex-grow">
                <div className="h-2 w-24 bg-zinc-900 rounded animate-pulse" />
                <div className="h-4 w-full bg-zinc-900/50 rounded animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="w-full max-w-3xl p-6 pb-8">
          <div className="bg-[#111] border border-white/10 rounded-[32px] p-2 shadow-2xl focus-within:border-white/20 transition-all backdrop-blur-2xl">
            <div className="flex gap-1.5 mb-2 px-3">
              {[
                { id: 'chat', icon: <MessageSquare size={13}/>, label: 'Chat' },
                { id: 'code', icon: <Code size={13}/>, label: 'Code' },
                { id: 'image', icon: <ImageIcon size={13}/>, label: 'Image' },
                { id: 'video', icon: <Video size={13}/>, label: 'Video' }
              ].map(t => (
                <button key={t.id} onClick={() => setMode(t.id as any)} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${mode === t.id ? 'bg-white/10 text-white border border-white/10 shadow-lg' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2 px-3 pb-1">
              <textarea 
                rows={1}
                value={prompt} 
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAction())}
                placeholder={`Ask Arena anything...`} 
                className="flex-grow bg-transparent p-2.5 outline-none text-base resize-none max-h-40 text-zinc-100 placeholder-zinc-700" 
              />
              <button onClick={handleAction} disabled={loading || !prompt.trim()} className="bg-zinc-100 text-black p-3 rounded-full hover:bg-white transition-all disabled:opacity-5 shadow-lg active:scale-95 transform">
                <Send size={18} />
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center px-4 mt-4">
             <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">Powered by Llama 3.1 & Flux</p>
             <p className="text-[9px] text-zinc-800 uppercase tracking-widest">Built for Performance</p>
          </div>
        </div>
      </div>
    </div>
  );
}