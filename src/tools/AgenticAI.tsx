import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2, Send, User, Bot, Zap, Plus } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('chat');
  const [credits, setCredits] = useState(0);
  const [user, setUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const handleGenerate = async () => {
    if (!prompt.trim() || !user || credits < 1) return;
    
    const userPrompt = prompt;
    setMessages(prev => [...prev, { role: 'user', content: userPrompt }]);
    setLoading(true);
    setPrompt('');

    try {
      // Session Persistence
      let sessionId = currentSessionId;
      if (!sessionId) {
        const { data: ns } = await supabase.from('chat_sessions').insert({ user_id: user.id, title: userPrompt.substring(0, 30), mode }).select().single();
        if (ns) { sessionId = ns.id; setCurrentSessionId(ns.id); setSessions(p => [ns, ...p]); }
      }

      const response = await fetch('/api/agent', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt, mode, sessionId }),
      });

      const data = await response.json();
      const aiText = data.text || "No response.";

      // Typing Animation
      let i = 0;
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      const timer = setInterval(() => {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = aiText.substring(0, i);
          return updated;
        });
        i += 10;
        if (i > aiText.length) { clearInterval(timer); setLoading(false); }
      }, 20);

      await supabase.from('profiles').update({ credits: credits - 1 }).eq('id', user.id);
      setCredits(prev => prev - 1);

    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection Error: Failed to reach AI cluster." }]);
      setLoading(false);
    }
  };

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [messages, loading]);

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col p-4">
        <button onClick={() => { setMessages([]); setCurrentSessionId(null); }} className="flex items-center justify-center gap-2 w-full p-3 mb-6 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-xs uppercase transition-all">
          <Plus size={16} /> New Arena
        </button>
        <div className="flex-grow overflow-y-auto space-y-2">
          {sessions.map(s => (
            <button key={s.id} onClick={() => setCurrentSessionId(s.id)} className={`w-full p-3 rounded-lg text-left text-xs truncate transition-all ${currentSessionId === s.id ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-grow flex flex-col relative">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg"><Sparkles size={16} /></div>
            <h2 className="text-sm font-black uppercase italic tracking-widest">Arena AI</h2>
          </div>
          <div className="text-[10px] font-bold bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-full border border-yellow-500/20 flex items-center gap-2">
            <Zap size={12} fill="currentColor" /> {credits} Credits
          </div>
        </div>

        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-8">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-800'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 shadow-lg shadow-blue-600/20' : 'bg-white/5 border border-white/5'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {loading && <div className="flex justify-start"><div className="bg-white/5 p-4 rounded-2xl flex items-center gap-2 text-xs text-gray-500 italic"><Loader2 size={14} className="animate-spin text-blue-500" /> Connecting to Cluster...</div></div>}
        </div>

        {/* Input Area */}
        <div className="p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center bg-[#111] border border-white/10 rounded-2xl p-2 focus-within:border-blue-500/50 shadow-2xl transition-all">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())}
                placeholder="Ask the cluster..."
                className="flex-grow bg-transparent p-3 outline-none text-sm resize-none"
                rows={1}
              />
              <button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="p-3 bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-30">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}