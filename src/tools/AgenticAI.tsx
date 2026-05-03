import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, Loader2, MessageSquare, ImageIcon, Video, Code } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [mode, setMode] = useState<'chat' | 'image' | 'video' | 'code'>('chat');
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(0);
  const [user, setUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load User & Session List
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: hist } = await supabase.from('chat_sessions')
          .select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
        if (hist) setSessions(hist);
        const { data: prof } = await supabase.from('profiles').select('credits').eq('id', session.user.id).single();
        if (prof) setCredits(prof.credits);
      }
    };
    init();
  }, []);

  // FIX: Load history ONLY for the active session
  useEffect(() => {
    if (!currentSessionId) {
      setMessages([]);
      return;
    }
    const loadMessages = async () => {
      setLoading(true);
      const { data } = await supabase.from('chat_messages')
        .select('*')
        .eq('session_id', currentSessionId) // STOPS DUPLICATION
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
      setLoading(false);
    };
    loadMessages();
  }, [currentSessionId]);

  const handleGenerate = async () => {
    if (!prompt.trim() || !user || credits < 1) return;
    const userMsg = prompt;
    setLoading(true);
    setPrompt('');

    try {
      let activeSession = currentSessionId;
      if (!activeSession) {
        const { data } = await supabase.from('chat_sessions')
          .insert({ user_id: user.id, title: userMsg.slice(0, 30) }).select().single();
        if (data) {
          activeSession = data.id;
          setCurrentSessionId(data.id);
          setSessions(prev => [data, ...prev]);
        }
      }

      await supabase.from('chat_messages').insert({ session_id: activeSession, role: 'user', content: userMsg });
      setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg, mode }),
      });
      const data = await res.json();
      
      await supabase.from('chat_messages').insert({ session_id: activeSession, role: 'assistant', content: data.text });
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);

      const { data: updatedProf } = await supabase.from('profiles').update({ credits: credits - 1 }).eq('id', user.id).select('credits').single();
      if (updatedProf) setCredits(updatedProf.credits);

    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-950 border-r border-white/5 p-4 flex flex-col">
        <button onClick={() => setCurrentSessionId(null)} className="bg-blue-600 p-3 rounded-xl font-bold flex items-center justify-center gap-2 mb-4 hover:bg-blue-700 transition-all">
          <Plus size={18}/> New Session
        </button>
        <div className="flex-grow overflow-y-auto space-y-2">
          {sessions.map(s => (
            <button key={s.id} onClick={() => setCurrentSessionId(s.id)} className={`w-full p-3 rounded-lg text-left text-xs truncate ${currentSessionId === s.id ? 'bg-white/10' : 'text-zinc-500 hover:text-white'}`}>
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col">
        <div className="flex-grow overflow-y-auto p-6 space-y-4" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[80%] ${m.role === 'user' ? 'bg-blue-600' : 'bg-zinc-900 border border-white/10'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && <Loader2 className="animate-spin text-blue-500 mx-auto" />}
        </div>

        {/* MODE BUTTONS + INPUT */}
        <div className="p-6 bg-zinc-950 border-t border-white/5">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex justify-center gap-4">
              {[
                { id: 'chat', icon: <MessageSquare size={16}/>, label: 'Chat' },
                { id: 'image', icon: <ImageIcon size={16}/>, label: 'Image' },
                { id: 'video', icon: <Video size={16}/>, label: 'Video' },
                { id: 'code', icon: <Code size={16}/>, label: 'Code' }
              ].map(item => (
                <button 
                  key={item.id} 
                  onClick={() => setMode(item.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${mode === item.id ? 'bg-blue-600 text-white' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 bg-zinc-900 border border-white/10 p-2 rounded-2xl items-center shadow-2xl">
              <input value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} className="flex-grow bg-transparent p-3 outline-none text-sm" placeholder={`Message in ${mode} mode...`} />
              <button onClick={handleGenerate} className="bg-blue-600 p-3 rounded-xl hover:scale-105 active:scale-95 transition-transform">
                <Send size={18}/>
              </button>
            </div>
            <p className="text-center text-[10px] text-zinc-600">Credits available: {credits}</p>
          </div>
        </div>
      </div>
    </div>
  );
}