import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquare, ImageIcon, Video, Code, Zap, Trash2, Bot, User, Sparkles, Volume2, Play } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>(() => {
    const saved = localStorage.getItem('arena_core_chat_session');
    return saved ? JSON.parse(saved) : [];
  });
  const [mode, setMode] = useState<'chat' | 'image' | 'video' | 'code'>('chat');
  const [loading, setLoading] = useState(false);
  const [ttsLoading, setTtsLoading] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync to Local Storage and Auto-scroll
  useEffect(() => {
    localStorage.setItem('arena_core_chat_session', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  // Load Credits
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
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.data || data.text, 
        type: data.type || 'text',
        engine: data.engine 
      }]);

      await supabase.from('profiles').update({ credits: credits - 1 }).eq('id', (await supabase.auth.getUser()).data.user?.id);

    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}`, type: 'text' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleTTS = async (text: string, messageId: string) => {
    if (ttsLoading || !text) return;
    setTtsLoading(messageId);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textToSpeak: text.substring(0, 500) }), // Limit length for speed
      });
      const data = await res.json();
      if (data.type === 'audio' && data.data && audioRef.current) {
        audioRef.current.src = data.data;
        audioRef.current.play();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTtsLoading(null);
    }
  };

  return (
    <div className="flex h-screen bg-[#090909] text-zinc-100 font-sans selection:bg-blue-500/20">
      <audio ref={audioRef} hidden />
      <div className="flex-grow flex flex-col items-center overflow-hidden">
        
        {/* Arena Header */}
        <div className="w-full max-w-6xl p-4 flex justify-between items-center bg-black/30 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/10">A</div>
            <span className="font-bold tracking-tight text-white uppercase text-xs">Arena Multi-AI Core</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono bg-zinc-900 px-3 py-1.5 rounded-full border border-white/10 text-zinc-400">
              {credits} CREDITS
            </span>
            <button onClick={() => { setMessages([]); localStorage.removeItem('arena_core_chat_session'); }} className="p-2.5 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-all rounded-lg">
              <Trash2 size={17} />
            </button>
          </div>
        </div>

        {/* Professional Stream */}
        <div className="w-full max-w-4xl flex-grow overflow-y-auto px-6 py-10 space-y-12" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-3">
              <Zap size={50} />
              <p className="font-medium text-base tracking-tight text-zinc-400">Start an expert-level session.</p>
              <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-700">Llama 3.3 70B & Wan 2.2 Active</p>
            </div>
          )}
          
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-6 animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center border ${m.role === 'user' ? 'bg-zinc-800 border-white/10' : 'bg-blue-600/10 text-blue-500 border-blue-500/20 shadow-blue-500/5'}`}>
                {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className="flex-grow space-y-1 pt-0.5">
                <div className="flex items-center gap-3">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                      {m.role === 'user' ? 'You' : m.engine || 'Arena AI'}
                    </p>
                    {m.role === 'assistant' && m.type === 'text' && (
                        <button 
                            onClick={() => handleTTS(m.content, `msg-${i}`)}
                            className="text-zinc-600 hover:text-blue-500 transition-colors"
                            title="Microsoft SpeechT5 TTS"
                        >
                            {ttsLoading === `msg-${i}` ? <Loader2 className="animate-spin" size={14} /> : <Volume2 size={14} />}
                        </button>
                    )}
                </div>
                {m.type === 'video' ? (
                  <video src={m.content} controls autoPlay loop className="rounded-2xl border border-white/10 max-w-lg shadow-2xl mt-2 ring-1 ring-white/10" alt="Generated" />
                ) : (
                  <div className={`text-[15px] leading-relaxed text-zinc-200 whitespace-pre-wrap ${m.role === 'user' ? 'text-zinc-100 bg-white/5 p-4 rounded-2xl border border-white/5 shadow-xl' : 'text-zinc-300'}`}>{m.content}</div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-6 animate-pulse">
              <div className="w-9 h-9 bg-zinc-900 rounded-full border border-white/5" />
              <div className="space-y-2 pt-1 flex-grow">
                <div className="h-4 w-1/4 bg-zinc-900 rounded" />
                <div className="h-4 w-full bg-zinc-900/50 rounded" />
              </div>
            </div>
          )}
        </div>

        {/* Input Bar Dock */}
        <div className="w-full max-w-4xl p-6 pb-8 sticky bottom-0">
          <div className="bg-[#141414] border border-white/10 rounded-[32px] p-2.5 shadow-2xl focus-within:border-white/20 transition-all backdrop-blur-3xl">
            {/* Mode Logic */}
            <div className="flex gap-1 mb-2 px-1">
              {[
                { id: 'chat', icon: <MessageSquare size={13}/>, label: 'Chat' },
                { id: 'code', icon: <Code size={13}/>, label: 'Expert Code' },
                { id: 'image', icon: <ImageIcon size={13}/>, label: 'Image (Disabled)' },
                { id: 'video', icon: <Video size={13}/>, label: 'Video (Wan)' }
              ].map(t => (
                <button key={t.id} onClick={() => setMode(t.id as any)} disabled={t.id === 'image'} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${mode === t.id ? 'bg-white/10 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300 disabled:opacity-20'}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            {/* Input Element */}
            <div className="flex items-end gap-2.5 px-3 pb-0.5">
              <textarea 
                rows={1}
                value={prompt} 
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAction())}
                placeholder={`Request multi-AI in ${mode} mode...`} 
                className="flex-grow bg-transparent p-2.5 outline-none text-[15px] resize-none max-h-40 text-zinc-100 placeholder-zinc-700" 
              />
              <button 
                onClick={handleAction} 
                disabled={loading || !prompt.trim()} 
                className="bg-zinc-100 text-black p-3 rounded-full hover:bg-white transition-all disabled:opacity-10 shadow-lg"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
            </div>
          </div>
          <div className="text-center px-4 mt-4 font-mono text-[9px] uppercase tracking-widest text-zinc-800">
             Arena Core | Llama 3.3 Versatile & Wan 2.2 TI2V
          </div>
        </div>
      </div>
    </div>
  );
}