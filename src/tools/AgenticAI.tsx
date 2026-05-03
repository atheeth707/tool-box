import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(0);
  const [user, setUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: hist } = await supabase.from('chat_sessions')
          .select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
        if (hist) setSessions(hist);
        const { data: prof } = await supabase.from('profiles')
          .select('credits').eq('id', session.user.id).single();
        if (prof) setCredits(prof.credits);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const loadChatHistory = async () => {
      if (!currentSessionId) {
        setMessages([]);
        return;
      }
      setLoading(true);
      const { data } = await supabase.from('chat_messages')
        .select('*').eq('session_id', currentSessionId).order('created_at', { ascending: true });
      if (data) setMessages(data);
      setLoading(false);
    };
    loadChatHistory();
  }, [currentSessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

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
        body: JSON.stringify({ prompt: userMsg }),
      });
      
      const data = await res.json();
      
      // Even if res.ok is false (status 500), our new backend sends the error in data.text
      const aiText = data.text || "Critical Backend Failure: Check Vercel Logs.";

      await supabase.from('chat_messages').insert({ session_id: activeSession, role: 'assistant', content: aiText });
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);

      const newCredits = credits - 1;
      await supabase.from('profiles').update({ credits: newCredits }).eq('id', user.id);
      setCredits(newCredits);

    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: `Network Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 bg-zinc-950 border-r border-white/5 p-4 flex-col">
        <button onClick={() => setCurrentSessionId(null)} className="bg-blue-600 hover:bg-blue-700 transition-colors p-3 rounded-xl font-bold flex items-center justify-center gap-2 mb-4">
          <Plus size={18}/> New Chat
        </button>
        <div className="flex-grow overflow-y-auto space-y-2 pr-2">
          {sessions.map(s => (
            <button key={s.id} onClick={() => setCurrentSessionId(s.id)} className={`w-full p-3 rounded-lg text-left text-xs truncate ${currentSessionId === s.id ? 'bg-white/10 text-white' : 'text-zinc-500 hover:bg-white/5'}`}>
              {s.title}
            </button>
          ))}
        </div>
        <div className="mt-4 p-3 bg-zinc-900 rounded-lg text-blue-400 font-medium text-xs text-center border border-white/5">
          Credits: {credits}
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-grow flex flex-col min-w-0">
        <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6" ref={scrollRef}>
          {messages.length === 0 && !loading && (
             <div className="h-full flex items-center justify-center text-zinc-600 font-medium">
               Send a message to start a new session.
             </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[90%] md:max-w-[80%] whitespace-pre-wrap ${m.role === 'user' ? 'bg-blue-600' : 'bg-zinc-900 border border-white/10'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10">
                 <Loader2 className="animate-spin text-blue-500" size={20} />
               </div>
             </div>
          )}
        </div>
        <div className="p-4 md:p-6 border-t border-white/5 bg-zinc-950/50">
          <div className="max-w-4xl mx-auto flex gap-2 bg-zinc-900 border border-white/10 p-2 rounded-2xl items-center">
            <input 
               value={prompt} 
               onChange={e => setPrompt(e.target.value)} 
               onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} 
               className="flex-grow bg-transparent p-3 outline-none text-sm md:text-base" 
               placeholder="Type a message..." 
               disabled={loading}
            />
            <button 
               onClick={handleGenerate} 
               disabled={loading || !prompt.trim()}
               className="bg-blue-600 disabled:opacity-50 hover:bg-blue-700 transition-colors p-3 rounded-xl"
            >
               <Send size={18}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}