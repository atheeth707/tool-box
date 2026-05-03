import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquare, ImageIcon, Video, Code, Plus, User, Bot, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(localStorage.getItem('active_session'));
  const [mode, setMode] = useState<'chat' | 'image' | 'video' | 'code'>('chat');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize User and Load Persistent History
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        if (sessionId) {
          const { data } = await supabase.from('chat_messages')
            .select('*').eq('session_id', sessionId).order('created_at', { ascending: true });
          if (data) setMessages(data);
        }
      }
    };
    init();
  }, [sessionId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const startNewSession = () => {
    const newId = crypto.randomUUID();
    setSessionId(newId);
    localStorage.setItem('active_session', newId);
    setMessages([]);
  };

  const handleSend = async () => {
    if (!prompt.trim() || !user || loading) return;

    let activeId = sessionId;
    if (!activeId) {
      activeId = crypto.randomUUID();
      setSessionId(activeId);
      localStorage.setItem('active_session', activeId);
    }

    const userText = prompt;
    setPrompt('');
    setLoading(true);

    // Persist User Message
    const { data: userEntry } = await supabase.from('chat_messages').insert({
      session_id: activeId, role: 'user', content: userText, type: 'text'
    }).select().single();
    if (userEntry) setMessages(prev => [...prev, userEntry]);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText, mode }),
      });
      const data = await res.json();

      // Persist AI Message
      const { data: aiEntry } = await supabase.from('chat_messages').insert({
        session_id: activeId,
        role: 'assistant',
        content: data.data || data.text,
        type: data.type || 'text',
        engine: data.engine
      }).select().single();
      if (aiEntry) setMessages(prev => [...prev, aiEntry]);

    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection failed.", type: 'text' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-zinc-200 font-sans">
      {/* Sleek Sidebar */}
      <div className="w-64 bg-black border-r border-white/5 p-4 flex flex-col hidden md:flex">
        <button onClick={startNewSession} className="flex items-center gap-2 p-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-sm font-medium mb-4">
          <Plus size={16} /> New Chat
        </button>
        <div className="flex-grow overflow-y-auto text-xs text-zinc-500 space-y-2">
          <p className="uppercase tracking-widest font-bold px-2">Current Session</p>
          <div className="p-2 bg-white/5 rounded-lg text-zinc-300 truncate">
            {messages[0]?.content || "Empty Chat"}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center relative overflow-hidden">
        {/* Header */}
        <div className="w-full max-w-4xl p-4 flex justify-between items-center z-10">
          <span className="font-black tracking-tighter text-xl text-white">ARENA <span className="text-blue-500">AI</span></span>
          <button onClick={() => { localStorage.removeItem('active_session'); setMessages([]); setSessionId(null); }} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-red-400">
            <Trash2 size={18} />
          </button>
        </div>

        {/* Chat Stream */}
        <div className="w-full max-w-3xl flex-grow overflow-y-auto p-4 space-y-8 scroll-smooth" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
              <div className="p-4 bg-zinc-900 rounded-3xl"><Bot size={48} /></div>
              <h2 className="text-2xl font-bold tracking-tight">How can I help you today?</h2>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className="flex gap-5 group">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-white/5 ${m.role === 'user' ? 'bg-zinc-800' : 'bg-blue-600/20 text-blue-400 border-blue-500/20'}`}>
                {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className="flex-grow space-y-2 pt-1">
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  {m.role === 'user' ? 'You' : m.engine || 'Arena AI'}
                </p>
                {m.type === 'image' ? (
                  <img src={m.content} className="rounded-2xl border border-white/10 max-w-sm shadow-2xl" alt="AI Generated" />
                ) : (
                  <div className="text-[15px] leading-relaxed whitespace-pre-wrap">{m.content}</div>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="flex gap-5 animate-pulse"><div className="w-9 h-9 bg-zinc-900 rounded-full" /><div className="h-4 w-24 bg-zinc-900 rounded mt-2" /></div>}
        </div>

        {/* Input Dock */}
        <div className="w-full max-w-3xl p-4 mb-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-[28px] p-2 shadow-2xl">
            <div className="flex gap-2 mb-2 px-2">
              {[
                { id: 'chat', icon: <MessageSquare size={14}/>, label: 'Chat' },
                { id: 'code', icon: <Code size={14}/>, label: 'Code' },
                { id: 'image', icon: <ImageIcon size={14}/>, label: 'Image' },
                { id: 'video', icon: <Video size={14}/>, label: 'Video' }
              ].map(t => (
                <button key={t.id} onClick={() => setMode(t.id as any)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${mode === t.id ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2 px-2 pb-1">
              <textarea 
                rows={1}
                value={prompt} 
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder={`Ask anything...`} 
                className="flex-grow bg-transparent p-2 outline-none text-base resize-none max-h-40" 
              />
              <button onClick={handleSend} disabled={loading || !prompt.trim()} className="bg-white text-black p-2.5 rounded-full hover:bg-zinc-200 transition-all disabled:opacity-10">
                <Send size={20} />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-zinc-600 mt-3">Arena AI can provide incorrect information. Verify important data.</p>
        </div>
      </div>
    </div>
  );
}