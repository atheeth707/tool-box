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

  // 1. Initial Load: Auth, Sessions, and Credits
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

  // 2. FIX: Automatically load history when currentSessionId changes
  useEffect(() => {
    const loadMessages = async () => {
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
    loadMessages();
  }, [currentSessionId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleGenerate = async () => {
    if (!prompt.trim() || !user || credits < 1) return;
    const userPrompt = prompt;
    setLoading(true);
    setPrompt('');

    try {
      let sessionId = currentSessionId;
      // Create session if it's a new chat
      if (!sessionId) {
        const { data: ns } = await supabase.from('chat_sessions')
          .insert({ user_id: user.id, title: userPrompt.substring(0, 30) }).select().single();
        if (ns) {
          sessionId = ns.id;
          setCurrentSessionId(ns.id);
          setSessions(p => [ns, ...p]);
        }
      }

      // Save user message to Supabase
      await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'user', content: userPrompt });
      setMessages(prev => [...prev, { role: 'user', content: userPrompt }]);

      const response = await fetch('/api/agent', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      const data = await response.json();
      const aiText = data.text || "AI Engine Error.";

      // Save AI response to Supabase
      await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'assistant', content: aiText });
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);

      // Update Credits
      const newCredits = credits - 1;
      await supabase.from('profiles').update({ credits: newCredits }).eq('id', user.id);
      setCredits(newCredits);

    } catch (err) {
      console.error("Generation failed:", err);
      setMessages(prev => [...prev, { role: 'assistant', content: "System Timeout. Check Vercel Logs." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-950 border-r border-white/5 p-4 flex flex-col">
        <button 
          onClick={() => setCurrentSessionId(null)} 
          className="bg-blue-600 hover:bg-blue-700 transition-colors p-3 rounded-xl font-bold flex items-center justify-center gap-2 mb-6"
        >
          <Plus size={18}/> New Chat
        </button>
        <div className="flex-grow overflow-y-auto space-y-2">
          {sessions.map(s => (
            <button 
              key={s.id} 
              onClick={() => setCurrentSessionId(s.id)} 
              className={`w-full p-3 rounded-lg text-left text-sm truncate transition-colors ${currentSessionId === s.id ? 'bg-white/10 text-white' : 'text-zinc-500 hover:bg-white/5'}`}
            >
              {s.title}
            </button>
          ))}
        </div>
        <div className="p-3 bg-zinc-900 rounded-lg text-xs text-blue-400">
          Credits remaining: {credits}
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="flex-grow flex flex-col min-w-0">
        <div className="flex-grow overflow-y-auto p-6 space-y-6" ref={scrollRef}>
          {messages.length === 0 && !loading && (
            <div className="h-full flex items-center justify-center text-zinc-600">
              Start a conversation to see magic happen.
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[85%] break-words ${m.role === 'user' ? 'bg-blue-600' : 'bg-zinc-900 border border-white/10'}`}>
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

        {/* Input Bar */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto flex gap-3 bg-zinc-900 border border-white/10 p-2 rounded-2xl items-center">
            <textarea 
              value={prompt} 
              onChange={e => setPrompt(e.target.value)} 
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
              className="flex-grow bg-transparent p-3 outline-none resize-none max-h-32" 
              placeholder="Ask anything..."
              rows={1}
            />
            <button 
              onClick={handleGenerate} 
              disabled={loading || !prompt.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 p-4 rounded-xl transition-all"
            >
              <Send size={20}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}