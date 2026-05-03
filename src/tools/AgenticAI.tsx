import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquare, ImageIcon, Video, Trash2, User, Bot, Volume2 } from 'lucide-react';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>(() => {
    const saved = localStorage.getItem('arena_v5_data');
    return saved ? JSON.parse(saved) : [];
  });
  const [mode, setMode] = useState<'chat' | 'image' | 'video'>('chat');
  const [loading, setLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    localStorage.setItem('arena_v5_data', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;
    
    // UI Feedback for user
    const userMsg = { role: 'user', content: prompt, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    const currentInput = prompt;
    setPrompt('');

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentInput, mode }),
      });
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned a crash page. Check your .env keys.");
      }
      
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "API Error");
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.data || data.text, 
        type: data.type || 'text'
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Error: ${err.message}`,
        type: 'text'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleTTS = async (text: string, index: number) => {
    setSpeakingId(index);
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
    } catch (err) {
      console.error(err);
    } finally { setSpeakingId(null); }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-100 font-sans">
      <audio ref={audioRef} hidden />
      <div className="flex-grow flex flex-col items-center">
        
        {/* Header */}
        <div className="w-full max-w-5xl p-5 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-2xl">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center font-black text-[10px]">AI</div>
            <span className="font-bold tracking-tighter text-sm uppercase opacity-70">Multimedia Agent</span>
          </div>
          <button onClick={() => { setMessages([]); localStorage.removeItem('arena_v5_data'); }} className="p-2 hover:bg-white/5 rounded-full text-zinc-700">
            <Trash2 size={16} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="w-full max-w-3xl flex-grow overflow-y-auto px-6 py-10 space-y-12" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className="flex gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center border ${m.role === 'user' ? 'bg-zinc-900 border-white/5' : 'bg-blue-600/10 text-blue-500 border-blue-500/20'}`}>
                {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="flex-grow space-y-2 pt-1">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{m.role === 'user' ? 'YOU' : 'AI'}</p>
                {m.type === 'image' ? (
                  <img src={m.content} className="rounded-2xl border border-white/10 w-full max-w-md shadow-2xl" alt="AI" />
                ) : m.type === 'video' ? (
                  <video src={m.content} controls className="rounded-2xl border border-white/10 w-full max-w-lg shadow-2xl" />
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="text-[15px] leading-relaxed text-zinc-300">{m.content}</div>
                    {m.role === 'assistant' && (
                      <button onClick={() => handleTTS(m.content, i)} className="mt-1 text-zinc-700 hover:text-blue-500">
                        {speakingId === i ? <Loader2 className="animate-spin" size={14} /> : <Volume2 size={14} />}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="flex items-center gap-2 text-zinc-500 text-xs italic"><Loader2 className="animate-spin" size={14}/> AI is thinking...</div>}
        </div>

        {/* Input Controls */}
        <div className="w-full max-w-3xl p-6 pb-12">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-[24px] p-2 shadow-2xl">
            <div className="flex gap-1 mb-2 px-1">
              {[
                { id: 'chat', icon: <MessageSquare size={12}/> },
                { id: 'image', icon: <ImageIcon size={12}/> },
                { id: 'video', icon: <Video size={12}/> }
              ].map(t => (
                <button key={t.id} onClick={() => setMode(t.id as any)} className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${mode === t.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-600 hover:text-zinc-300'}`}>
                  {t.icon} {t.id}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2 px-3 pb-1">
              <textarea rows={1} value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} placeholder={`Describe your ${mode}...`} className="flex-grow bg-transparent p-2 outline-none text-sm resize-none max-h-40 text-zinc-100" />
              <button onClick={handleSend} disabled={loading || !prompt.trim()} className="bg-white text-black p-2.5 rounded-full hover:bg-zinc-200 transition-all disabled:opacity-10">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}