import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Loader2, Image as ImageIcon, Video, Code, MessageSquare, 
  Send, User, Bot, Zap, Cpu, Plus, Trash2, ChevronDown, Settings2, X, Terminal
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

const MODEL_LIBRARY = {
  chat: [{ id: 'gemini-2-pro', name: "Gemini 2.0 Pro", provider: "Google AI" }, { id: 'llama-3-70b', name: "Llama 3 (70B)", provider: "Groq Cloud" }],
  image: [{ id: 'sdxl', name: "Stable Diffusion XL", provider: "Hugging Face" }],
  video: [{ id: 'veo-svd', name: "Veo / SVD", provider: "Hugging Face" }],
  code: [{ id: 'llama-3-code', name: "Llama 3 Code", provider: "Groq Cloud" }]
};

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AIMode>('chat');
  const [session, setSession] = useState<any>(null);
  const [credits, setCredits] = useState<number>(0);
  const [selectedEngines] = useState({ 
    chat: MODEL_LIBRARY.chat[0], 
    image: MODEL_LIBRARY.image[0], 
    video: MODEL_LIBRARY.video[0], 
    code: MODEL_LIBRARY.code[0] 
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Initialize Auth and Load Sidebar History
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
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) console.error("History Load Error:", error);
    if (data) setSessions(data);
  };

  const createNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setPrompt('');
  };

  // 2. Handle Generation with Real-Time Typing
  const handleGenerate = async () => {
    if (!prompt.trim() || !session || credits < 1) return;

    const userPrompt = prompt;
    const userMsg: Message = { role: 'user', content: userPrompt, mode };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setPrompt('');

    try {
      // Create session in Supabase if new chat
      let sessionId = currentSessionId;
      if (!sessionId) {
        const { data: newSession, error: sessErr } = await supabase.from('chat_sessions').insert({
          user_id: session.user.id,
          title: userPrompt.substring(0, 30),
          mode: mode
        }).select().single();
        
        if (sessErr) throw sessErr;
        if (newSession) {
          sessionId = newSession.id;
          setCurrentSessionId(sessionId);
          setSessions(prev => [newSession, ...prev]);
        }
      }

      // API Call
      const response = await fetch('/api/agent', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: userPrompt, 
          mode, 
          model_id: selectedEngines[mode].id,
          sessionId 
        }),
      });

      const data = await response.json();
      // Look for text in common AI JSON formats[cite: 1]
      const aiText = data.text || data.content || data.choices?.[0]?.message?.content || "Engine failed to respond.";

      // Start Typing Effect[cite: 1]
      let currentIdx = 0;
      const aiMsg: Message = { role: 'assistant', content: '', mode };
      setMessages(prev => [...prev, aiMsg]);

      const interval = setInterval(() => {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = aiText.substring(0, currentIdx);
          return updated;
        });
        currentIdx += 6; 
        if (currentIdx > aiText.length) {
          clearInterval(interval);
          setLoading(false);
        }
      }, 20);

      // Deduct credits[cite: 1]
      const { data: profile } = await supabase.from('profiles').update({ credits: credits - 1 }).eq('id', session.user.id).select().single();
      if (profile) setCredits(profile.credits);

    } catch (err: any) {
      console.error("Critical Error:", err);
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}`, mode }]);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR - History persistence[cite: 1] */}
      <div className="w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col p-4">
        <button onClick={createNewChat} className="flex items-center justify-center gap-2 w-full p-3 mb-6 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20">
          <Plus size={16} /> New Arena
        </button>
        
        <div className="flex-grow overflow-y-auto space-y-1 custom-scrollbar">
          <p className="text-[10px] text-gray-600 font-black uppercase mb-3 px-2 tracking-widest">History</p>
          {sessions.map(s => (
            <button 
              key={s.id} 
              onClick={() => setCurrentSessionId(s.id)} 
              className={`w-full p-3 rounded-lg text-left text-xs truncate transition-all flex items-center gap-2 ${currentSessionId === s.id ? 'bg-white/10 text-white border border-white/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              <MessageSquare size={12} className={currentSessionId === s.id ? 'text-blue-500' : ''} />
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* CHAT WINDOW */}
      <div className="flex-grow flex flex-col relative">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/50 backdrop-blur-2xl z-10">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-600/10 rounded-xl border border-blue-500/20"><Cpu size={18} className="text-blue-500" /></div>
            <div>
              <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Engine Cluster</p>
              <p className="text-sm font-black uppercase italic tracking-tighter">{selectedEngines[mode].name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-[10px] font-black bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-xl border border-yellow-500/20 flex items-center gap-2">
                <Zap size={12} fill="currentColor" /> {credits} CREDITS
             </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 md:p-12 space-y-10 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <Sparkles size={60} className="mb-6 text-blue-500" />
              <h1 className="text-5xl font-black italic tracking-tighter uppercase">Arena AI</h1>
              <p className="text-xs font-bold uppercase tracking-widest mt-4">Multi-Model Playground</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`max-w-[80%] flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xl ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-800 border border-white/10'}`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} className="text-blue-400" />}
                </div>
                <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-[#111] border border-white/5 rounded-tl-none'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {/* GENERATING STATUS[cite: 1] */}
          {loading && (
            <div className="flex justify-start">
               <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center border border-white/10"><Bot size={20} className="text-blue-500 animate-pulse" /></div>
                  <div className="bg-white/5 p-5 rounded-3xl rounded-tl-none border border-white/5 flex items-center gap-3 text-xs text-gray-500 font-bold italic">
                    <Loader2 size={16} className="animate-spin text-blue-500" />
                    Neural engine is processing...
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* INPUT BOX */}
        <div className="p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 mb-6 justify-center">
              {(['chat', 'image', 'video', 'code'] as AIMode[]).map(t => (
                <button key={t} onClick={() => setMode(t)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${mode === t ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'bg-white/5 text-gray-600 hover:text-white border border-transparent hover:border-white/10'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center bg-[#0d0d0d] border border-white/10 rounded-[2rem] p-3 focus-within:border-blue-500/50 shadow-2xl transition-all">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())}
                placeholder={`Query ${selectedEngines[mode].name}...`}
                className="flex-grow bg-transparent p-4 outline-none text-sm resize-none max-h-40"
                rows={1}
              />
              <button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="p-4 bg-blue-600 rounded-2xl hover:bg-blue-700 disabled:opacity-20 active:scale-90 transition-all shadow-lg shadow-blue-600/20">
                <Send size={20} />
              </button>
            </div>
            <p className="text-[9px] text-center text-gray-600 font-bold uppercase tracking-widest mt-4 opacity-50">Experimental Agentic Cluster • Use with Caution</p>
          </div>
        </div>
      </div>
    </div>
  );
}