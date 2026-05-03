import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Loader2, MessageSquare, 
  Send, User, Bot, Zap, Plus, Cpu
} from 'lucide-react';
import { supabase } from '../supabaseClient';

type AIMode = 'chat' | 'image' | 'video' | 'code';

interface ChatSession {
  id: string;
  title: string;
  mode: AIMode;
  created_at: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  mode: AIMode;
}

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AIMode>('chat');
  const [session, setSession] = useState<any>(null);
  const [credits, setCredits] = useState<number>(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Auth and fetch History
  useEffect(() => {
    const init = async () => {
      const { data: { session: activeSession } } = await supabase.auth.getSession();
      setSession(activeSession);
      if (activeSession) {
        fetchSessions(activeSession.user.id);
        const { data: profile } = await supabase.from('profiles').select('credits').eq('id', activeSession.user.id).single();
        if (profile) setCredits(profile.credits);
      }
    };
    init();
  }, []);

  const fetchSessions = async (userId: string) => {
    const { data } = await supabase.from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (data) setSessions(data);
  };

  const createNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setPrompt('');
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !session || credits < 1) return;

    const userPrompt = prompt;
    setMessages(prev => [...prev, { role: 'user', content: userPrompt, mode }]);
    setLoading(true);
    setPrompt('');

    try {
      // 1. Manage Session Persistence
      let sessionId = currentSessionId;
      if (!sessionId) {
        const { data: newSession } = await supabase.from('chat_sessions').insert({
          user_id: session.user.id,
          title: userPrompt.substring(0, 30),
          mode: mode
        }).select().single();
        if (newSession) {
          sessionId = newSession.id;
          setCurrentSessionId(sessionId);
          setSessions(prev => [newSession, ...prev]);
        }
      }

      // 2. API Call with Safe JSON Check
      const response = await fetch('/api/agent', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt, mode, sessionId }),
      });

      // Verify if the response is actually JSON to avoid the "Unexpected character" error
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response. Please check API logs.");
      }

      const data = await response.json();
      const aiText = data.text || data.content || "Response received, but content is empty.";

      // 3. Generating/Typing Effect[cite: 1]
      let currentIdx = 0;
      setMessages(prev => [...prev, { role: 'assistant', content: '', mode }]);
      
      const interval = setInterval(() => {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = aiText.substring(0, currentIdx);
          return updated;
        });
        currentIdx += 8; 
        if (currentIdx > aiText.length) {
          clearInterval(interval);
          setLoading(false);
        }
      }, 15);

      // 4. Update Credits[cite: 1]
      await supabase.from('profiles').update({ credits: credits - 1 }).eq('id', session.user.id);
      setCredits(prev => prev - 1);

    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}`, mode }]);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      
      {/* SIDEBAR - Chat History[cite: 1] */}
      <div className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col p-4">
        <button onClick={createNewChat} className="flex items-center justify-center gap-2 w-full p-3 mb-6 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all font-bold text-xs uppercase">
          <Plus size={16} /> New Chat
        </button>
        <div className="flex-grow overflow-y-auto space-y-2">
          <p className="text-[10px] text-gray-500 font-bold uppercase px-2">History</p>
          {sessions.map(s => (
            <button 
              key={s.id} 
              onClick={() => setCurrentSessionId(s.id)} 
              className={`w-full p-3 rounded-lg text-left text-xs truncate transition-all ${currentSessionId === s.id ? 'bg-white/10' : 'text-gray-500 hover:text-white'}`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* CHAT MAIN */}
      <div className="flex-grow flex flex-col relative">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg"><Sparkles size={16} /></div>
            <h2 className="text-sm font-bold tracking-tight">Arena AI</h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-[11px] font-bold bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-full border border-yellow-500/20 flex items-center gap-2">
                <Zap size={12} fill="currentColor" /> {credits} Credits
             </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-8">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-10">
              <h1 className="text-6xl font-black italic">ARENA</h1>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-800'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600' : 'bg-white/5 border border-white/5'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {/* GENERATING STATUS[cite: 1] */}
          {loading && (
            <div className="flex justify-start">
               <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center"><Bot size={16} /></div>
                  <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-2 text-xs text-gray-400 italic">
                    <Loader2 size={14} className="animate-spin text-blue-500" />
                    AI is generating...
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2 mb-4 justify-center">
              {(['chat', 'image', 'video', 'code'] as AIMode[]).map(t => (
                <button key={t} onClick={() => setMode(t)} className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${mode === t ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-500'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center bg-[#111] border border-white/10 rounded-2xl p-2 focus-within:border-blue-500/50">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())}
                placeholder="Ask anything..."
                className="flex-grow bg-transparent p-3 outline-none text-sm resize-none"
                rows={1}
              />
              <button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="p-3 bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-20">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}