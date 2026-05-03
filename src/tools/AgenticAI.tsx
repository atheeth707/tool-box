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

  // 1. Initial Load: Get User, History List, and Credits
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

  // 2. FIX: Load Chat Content when a session is selected
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

  const handleGenerate = async () => {
    if (!prompt.trim() || !user || credits < 1) return;
    const userMsg = prompt;
    setLoading(true);
    setPrompt('');

    try {
      let activeSession = currentSessionId;

      // Create new session if needed
      if (!activeSession) {
        const { data } = await supabase.from('chat_sessions')
          .insert({ user_id: user.id, title: userMsg.slice(0, 30) }).select().single();
        if (data) {
          activeSession = data.id;
          setCurrentSessionId(data.id);
          setSessions(prev => [data, ...prev]);
        }
      }

      // Save user message to DB
      await supabase.from('chat_messages').insert({ session_id: activeSession, role: 'user', content: userMsg });
      setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg }),
      });
      const data = await res.json();
      const aiText = data.text || "AI engines failed.";

      // Save AI response to DB[cite: 2]
      await supabase.from('chat_messages').insert({ session_id: activeSession, role: 'assistant', content: aiText });
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);

      // Update Credits
      const newCredits = credits - 1;
      await supabase.from('profiles').update({ credits: newCredits }).eq('id', user.id);
      setCredits(newCredits);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-950 border-r border-white/5 p-4 flex flex-col">
        <button onClick={() => setCurrentSessionId(null)} className="bg-blue-600 p-3 rounded-xl font-bold flex items-center justify-center gap-2 mb-4">
          <Plus size={18}/> New Chat
        </button>
        <div className="flex-grow overflow-y-auto space-y-2">
          {sessions.map(s => (
            <button key={s.id} onClick={() => setCurrentSessionId(s.id)} className={`w-full p-3 rounded-lg text-left text-xs truncate ${currentSessionId === s.id ? 'bg-white/10' : 'text-zinc-500'}`}>
              {s.title}
            </button>
          ))}
        </div>
        <div className="mt-4 p-2 bg-zinc-900 rounded text-blue-400 text-xs text-center">
          Credits: {credits}
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-grow flex flex-col">
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[80%] ${m.role === 'user' ? 'bg-blue-600' : 'bg-zinc-900 border border-white/10'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && <Loader2 className="animate-spin text-blue-500 mx-auto" />}
        </div>
        <div className="p-6">
          <div className="max-w-3xl mx-auto flex gap-2 bg-zinc-900 border border-white/10 p-2 rounded-2xl">
            <input value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} className="flex-grow bg-transparent p-3 outline-none" placeholder="Type a message..." />
            <button onClick={handleGenerate} className="bg-blue-600 p-3 rounded-xl"><Send/></button>
          </div>
        </div>
      </div>
    </div>
  );
}