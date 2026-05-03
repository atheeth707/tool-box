import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2, Send, User, Bot, Zap, Plus } from 'lucide-react';
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

  // 1. Initial Load (Sessions & Profile)
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: hist } = await supabase.from('chat_sessions').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
        if (hist) setSessions(hist);
        const { data: prof } = await supabase.from('profiles').select('credits').eq('id', session.user.id).single();
        if (prof) setCredits(prof.credits);
      }
    };
    init();
  }, []);

  // 2. FIX: Load History when a session is clicked
  useEffect(() => {
    const loadSessionMessages = async () => {
      if (!currentSessionId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_messages') // Ensure your table name is correct
        .select('*')
        .eq('session_id', currentSessionId)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data.map(m => ({ role: m.role, content: m.content })));
      setLoading(false);
    };
    loadSessionMessages();
  }, [currentSessionId]);

  const handleGenerate = async () => {
    if (!prompt.trim() || !user || credits < 1) return;
    const userPrompt = prompt;
    setMessages(prev => [...prev, { role: 'user', content: userPrompt }]);
    setLoading(true);
    setPrompt('');

    try {
      let sessionId = currentSessionId;
      if (!sessionId) {
        const { data: ns } = await supabase.from('chat_sessions').insert({ user_id: user.id, title: userPrompt.substring(0, 30) }).select().single();
        if (ns) { sessionId = ns.id; setCurrentSessionId(ns.id); setSessions(p => [ns, ...p]); }
      }

      // Save user message to Supabase history
      await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'user', content: userPrompt });

      const response = await fetch('/api/agent', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      const data = await response.json();
      const aiText = data.text || "AI Error.";

      // Save AI response to Supabase history
      await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'assistant', content: aiText });

      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
      await supabase.from('profiles').update({ credits: credits - 1 }).eq('id', user.id);
      setCredits(prev => prev - 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-[#0a0a0a] border-r border-white/5 p-4 flex flex-col">
        <button onClick={() => { setMessages([]); setCurrentSessionId(null); }} className="bg-blue-600 p-3 rounded-xl font-bold flex items-center justify-center gap-2 mb-4">
          <Plus size={18}/> New Chat
        </button>
        <div className="flex-grow overflow-y-auto space-y-2">
          {sessions.map(s => (
            <button key={s.id} onClick={() => setCurrentSessionId(s.id)} className={`w-full p-3 rounded-lg text-left text-xs truncate ${currentSessionId === s.id ? 'bg-white/10' : 'text-gray-500'}`}>
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow flex flex-col">
        <div className="flex-grow overflow-y-auto p-6 space-y-6" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[80%] ${m.role === 'user' ? 'bg-blue-600' : 'bg-white/5 border border-white/10'}`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>
        <div className="p-6">
          <div className="max-w-3xl mx-auto flex gap-2 bg-[#111] border border-white/10 p-2 rounded-2xl">
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="flex-grow bg-transparent p-3 outline-none" placeholder="Ask AI..."/>
            <button onClick={handleGenerate} className="bg-blue-600 p-3 rounded-xl"><Send/></button>
          </div>
        </div>
      </div>
    </div>
  );
}