import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquare, ImageIcon, Video, Code, Zap, Trash2, Bot, User } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>([]); 
  const [mode, setMode] = useState<'chat' | 'image' | 'video' | 'code'>('chat');
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(0);
  const [user, setUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase.from('profiles').select('credits').eq('id', session.user.id).single();
        if (data) setCredits(data.credits);
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleAction = async () => {
    if (!prompt.trim() || credits < 1 || loading) return;
    
    const userText = prompt;
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setLoading(true);
    setPrompt('');

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText, mode }),
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.data || data.text, 
        type: data.type || 'text',
        engine: data.engine 
      }]);

      const { data: updated } = await supabase.from('profiles')
        .update({ credits: credits - 1 }).eq('id', user.id).select('credits').single();
      if (updated) setCredits(updated.credits);

    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Cluster connection failed." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-100 font-sans">
      <div className="flex-grow flex flex-col max-w-4xl mx-auto w-full border-x border-white/5">
        
        {/* Navbar */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-blue-500 fill-blue-500" />
            <span className="font-black uppercase tracking-tighter text-lg">Arena AI</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[10px] font-bold px-3 py-1 bg-white/5 rounded-full border border-white/10 uppercase">
              {credits} Credits left
            </div>
            <button onClick={() => setMessages([])} className="text-zinc-500 hover:text-red-400 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-8" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <MessageSquare size={64} />
              <p className="mt-4 font-bold uppercase tracking-widest text-xs">No History Found</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${m.role === 'user' ? 'bg-blue-600 border-blue-400' : 'bg-zinc-900 border-white/10'}`}>
                  {m.role === 'user' ? <User size={18}/> : <Bot size={18}/>}
                </div>
                <div className={`p-4 rounded-2xl relative ${m.role === 'user' ? 'bg-blue-600' : 'bg-zinc-900 border border-white/5 shadow-2xl'}`}>
                  {m.type === 'image' ? <img src={m.content} className="rounded-lg shadow-xl" alt="AI Gen" /> : <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</div>}
                  {m.engine && <div className="absolute -bottom-5 left-1 text-[8px] text-zinc-600 font-mono uppercase tracking-widest">{m.engine}</div>}
                </div>
              </div>
            </div>
          ))}
          {loading && <div className="flex justify-start animate-pulse"><div className="w-9 h-9 bg-zinc-800 rounded-xl" /></div>}
        </div>

        {/* Controls */}
        <div className="p-6 bg-gradient-to-t from-black to-transparent">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex justify-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
              {[
                { id: 'chat', icon: <MessageSquare size={14}/>, label: 'Chat' },
                { id: 'code', icon: <Code size={14}/>, label: 'Code' },
                { id: 'image', icon: <ImageIcon size={14}/>, label: 'Image' },
                { id: 'video', icon: <Video size={14}/>, label: 'Video' }
              ].map(t => (
                <button key={t.id} onClick={() => setMode(t.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${mode === t.id ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:bg-white/5'}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2 bg-zinc-900/80 border border-white/10 p-2 rounded-2xl shadow-2xl items-center focus-within:border-blue-500/50 transition-all">
              <input value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAction()} placeholder={`Prompt for ${mode}...`} className="flex-grow bg-transparent p-3 outline-none text-sm" />
              <button onClick={handleAction} disabled={loading || !prompt.trim()} className="bg-blue-600 p-4 rounded-xl hover:bg-blue-500 disabled:opacity-20 transition-all">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}