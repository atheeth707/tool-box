import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquare, ImageIcon, Video, Code, Trash2, User, Bot, Sparkles } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>(() => {
    // Load chat from local storage on first run
    const saved = localStorage.getItem('arena_chat_session');
    return saved ? JSON.parse(saved) : [];
  });
  const [mode, setMode] = useState<'chat' | 'image' | 'video' | 'code'>('chat');
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Save to Local Storage whenever messages change
  useEffect(() => {
    localStorage.setItem('arena_chat_session', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  // Fetch Credits (assuming profile table still exists)
  useEffect(() => {
    const fetchCredits = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('credits').eq('id', session.user.id).single();
        if (data) setCredits(data.credits);
      }
    };
    fetchCredits();
  }, [loading]);

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;

    const userMsg = { role: 'user', content: prompt, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    const currentPrompt = prompt;
    setPrompt('');

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt, mode }),
      });
      
      const data = await res.json();
      const aiMsg = { 
        role: 'assistant', 
        content: data.data || data.text, 
        type: data.type || 'text', 
        engine: data.engine 
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection Error.", type: 'text' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('arena_chat_session');
  };

  return (
    <div className="flex h-screen bg-[#0b0b0b] text-zinc-200 font-sans">
      <div className="flex-grow flex flex-col items-center overflow-hidden">
        
        {/* Top Navigation */}
        <div className="w-full max-w-5xl p-4 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white">A</div>
            <span className="font-bold tracking-tight text-white uppercase text-sm">Arena AI</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono bg-zinc-900 px-3 py-1 rounded-full border border-white/10 text-zinc-400">
              {credits} CREDITS
            </span>
            <button onClick={clearChat} className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="w-full max-w-3xl flex-grow overflow-y-auto px-4 py-8 space-y-10" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <Sparkles size={60} />
              <p className="mt-4 font-bold text-lg">Start a professional session</p>
            </div>
          )}
          
          {messages.map((m, i) => (
            <div key={i} className="flex gap-6 animate-in fade-in slide-in-from-bottom-2">
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border border-white/5 ${m.role === 'user' ? 'bg-zinc-800' : 'bg-blue-600/10 text-blue-500 border-blue-500/20'}`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className="flex-grow space-y-1">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  {m.role === 'user' ? 'You' : m.engine || 'Arena'}
                </p>
                {m.type === 'image' ? (
                  <img src={m.content} className="rounded-2xl border border-white/10 max-w-sm shadow-2xl mt-2" alt="AI Gen" />
                ) : (
                  <div className="text-[15px] leading-relaxed text-zinc-300 whitespace-pre-wrap">{m.content}</div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-6 animate-pulse">
              <div className="w-8 h-8 bg-zinc-900 rounded-full" />
              <div className="h-4 w-32 bg-zinc-900 rounded mt-2" />
            </div>
          )}
        </div>

        {/* Input Bar Section */}
        <div className="w-full max-w-3xl p-6">
          <div className="bg-[#161616] border border-white/10 rounded-3xl p-2 shadow-2xl focus-within:border-white/20 transition-all">
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-2 px-2">
              {[
                { id: 'chat', icon: <MessageSquare size={13}/>, label: 'Chat' },
                { id: 'code', icon: <Code size={13}/>, label: 'Code' },
                { id: 'image', icon: <ImageIcon size={13}/>, label: 'Image' },
                { id: 'video', icon: <Video size={13}/>, label: 'Video' }
              ].map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setMode(t.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${mode === t.id ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            {/* Text Input */}
            <div className="flex items-end gap-2 px-2 pb-1">
              <textarea 
                rows={1}
                value={prompt} 
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder={`Ask Arena in ${mode} mode...`} 
                className="flex-grow bg-transparent p-2 outline-none text-base resize-none max-h-40 text-zinc-100" 
              />
              <button 
                onClick={handleSend} 
                disabled={loading || !prompt.trim()} 
                className="bg-zinc-100 text-black p-2 rounded-2xl hover:bg-white transition-all disabled:opacity-10"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-zinc-700 mt-4 font-medium uppercase tracking-tighter">
            Arena AI Core | Powered by Groq, Gemini & Hugging Face
          </p>
        </div>
      </div>
    </div>
  );
}