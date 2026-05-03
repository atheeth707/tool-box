import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Loader2, Image as ImageIcon, Video, Code, MessageSquare, 
  Send, User, Bot, Zap, Settings2, ChevronDown, Plus, Trash2, Menu
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
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<AIMode>('chat');
  const [session, setSession] = useState<any>(null);
  const [credits, setCredits] = useState<number>(0);
  const [selectedEngines, setSelectedEngines] = useState({ chat: MODEL_LIBRARY.chat[0], image: MODEL_LIBRARY.image[0], video: MODEL_LIBRARY.video[0], code: MODEL_LIBRARY.code[0] });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Auth and Sessions
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
    const { data } = await supabase.from('chat_sessions').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (data) setSessions(data);
  };

  const createNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setPrompt('');
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !session || credits < 1) return;

    const userMsg: Message = { role: 'user', content: prompt, mode };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setIsTyping(true);
    const currentPrompt = prompt;
    setPrompt('');

    try {
      // 1. Logic to create session on first message
      let sessionId = currentSessionId;
      if (!sessionId) {
        const { data: newSession } = await supabase.from('chat_sessions').insert({
          user_id: session.user.id,
          title: currentPrompt.substring(0, 20) + "...",
          mode: mode
        }).select().single();
        if (newSession) {
          sessionId = newSession.id;
          setCurrentSessionId(sessionId);
          setSessions([newSession, ...sessions]);
        }
      }

      // 2. Fetch AI Response
      const res = await fetch('/api/agent', { 
        method: 'POST', 
        body: JSON.stringify({ prompt: currentPrompt, mode, model_id: selectedEngines[mode].id }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      
      // 3. Typing Effect
      const fullResponse = data.text || data.url;
      let currentIdx = 0;
      const aiMsg: Message = { role: 'assistant', content: '', mode };
      
      setMessages(prev => [...prev, aiMsg]);

      const interval = setInterval(() => {
        setMessages(prev => {
          const last = [...prev];
          last[last.length - 1].content = fullResponse.substring(0, currentIdx);
          return last;
        });
        currentIdx += 5; // Adjust for speed
        if (currentIdx > fullResponse.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 20);

      // 4. Update Credits
      await supabase.from('profiles').update({ credits: credits - 1 }).eq('id', session.user.id);
      setCredits(prev => prev - 1);

    } catch (err) {
      console.error(err);
      setIsTyping(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      
      {/* LEFT SIDEBAR: Chat History */}
      <div className="w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col p-4 space-y-4">
        <button 
          onClick={createNewChat}
          className="flex items-center gap-2 w-full p-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-bold text-sm"
        >
          <Plus size={18} /> New Arena Chat
        </button>

        <div className="flex-grow overflow-y-auto space-y-2 custom-scrollbar">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-black px-2">History</p>
          {sessions.map(s => (
            <button 
              key={s.id}
              onClick={() => setCurrentSessionId(s.id)}
              className={`flex items-center gap-3 w-full p-3 rounded-xl text-left text-sm transition-all ${currentSessionId === s.id ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'hover:bg-white/5 text-gray-400'}`}
            >
              <MessageSquare size={14} />
              <span className="truncate">{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-grow flex flex-col relative">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg"><Cpu size={16} /></div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">Arena Model</p>
              <p className="text-sm font-bold">{selectedEngines[mode].name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-xs font-bold bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full border border-yellow-500/20 flex items-center gap-2">
                <Zap size={12} fill="currentColor" /> {credits} Credits
             </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-8">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <Sparkles size={48} className="mb-4 text-blue-500" />
              <h2 className="text-xl font-black uppercase tracking-widest">Select Mode & Start</h2>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-800'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#111] border border-white/5'}`}>
                  {msg.content}
                  {isTyping && i === messages.length - 1 && msg.role === 'assistant' && <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 bg-gradient-to-t from-black to-transparent">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2 mb-4 justify-center">
              {(['chat', 'image', 'video', 'code'] as AIMode[]).map(t => (
                <button 
                  key={t}
                  onClick={() => setMode(t)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === t ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-500'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative flex items-center bg-[#151515] border border-white/10 rounded-2xl p-2 focus-within:border-blue-500/50 transition-all">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())}
                placeholder={`Message ${selectedEngines[mode].name}...`}
                className="flex-grow bg-transparent p-3 outline-none text-sm resize-none"
                rows={1}
              />
              <button 
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="p-3 bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-20"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}