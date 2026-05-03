import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, BrainCircuit, Loader2, AlertCircle, 
  Coins, Image as ImageIcon, Video, Code, MessageSquare, 
  Paperclip, X, Send, FileText, UserPlus, Cpu, User, Bot, Zap
} from 'lucide-react';
import { supabase } from '../supabaseClient';

type AIMode = 'chat' | 'image' | 'video' | 'code';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  mode: AIMode;
  timestamp: Date;
}

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<AIMode>('chat');
  const [session, setSession] = useState<any>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Map modes to your 3 API providers
  const engineMap = {
    chat: { name: "Gemini 2.0 Pro", provider: "Google AI" },
    image: { name: "Stable Diffusion XL", provider: "Hugging Face" },
    video: { name: "Veo / SVD", provider: "Hugging Face" },
    code: { name: "Llama 3 (70B)", provider: "Groq Cloud" }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        const { data: profile } = await supabase.from('profiles').select('credits').eq('id', session.user.id).single();
        if (profile) setCredits(profile.credits);
      }
      setAuthLoading(false);
    };
    checkAuth();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim() || !session || (credits !== null && credits < 1)) return;

    const userMsg: Message = { role: 'user', content: prompt, mode, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setError('');
    const currentPrompt = prompt;
    setPrompt('');

    try {
      const formData = new FormData();
      formData.append('prompt', currentPrompt);
      formData.append('mode', mode);

      const res = await fetch('/api/agent', { method: 'POST', body: formData });
      if (!res.ok) throw new Error("Agent overloaded. Please try again.");

      const data = await res.json();
      const aiMsg: Message = { 
        role: 'assistant', 
        content: data.text || data.url, 
        mode, 
        timestamp: new Date() 
      };
      
      setMessages(prev => [...prev, aiMsg]);
      
      const { data: profile } = await supabase.from('profiles').update({ credits: credits! - 1 }).eq('id', session.user.id).select().single();
      if (profile) setCredits(profile.credits);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><Loader2 className="animate-spin text-blue-500 w-12 h-12" /></div>;

  return (
    <div className="flex flex-col h-[85vh] max-w-5xl mx-auto bg-white dark:bg-[#050505] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden animate-in fade-in duration-500">
      
      {/* HEADER: Dynamic Engine Label */}
      <div className="p-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
             <Cpu className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Active Engine</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black dark:text-white uppercase tracking-tight">
                {engineMap[mode].name} 
              </span>
              <span className="text-[9px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-md font-bold border border-blue-500/20">
                {engineMap[mode].provider}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-yellow-500/10 px-4 py-2 rounded-2xl border border-yellow-500/20">
          <Zap size={14} className="text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-black text-yellow-700 dark:text-yellow-500 uppercase tracking-tighter">
            {credits} Credits
          </span>
        </div>
      </div>

      {/* CHAT AREA */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-blue-500 rounded-full blur-2xl opacity-20 animate-pulse" />
              <Sparkles className="w-16 h-16 text-blue-500 relative" />
            </div>
            <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Ready to Build?</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">Select a mode and describe your request to the {engineMap[mode].name} engine.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-300`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-800 border border-white/10'}`}>
                {msg.role === 'user' ? <User size={20} className="text-white" /> : <Bot size={20} className="text-blue-400" />}
              </div>
              <div className={`p-5 rounded-[1.5rem] text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-gray-50 dark:bg-[#111] dark:text-gray-200 rounded-tl-none border border-gray-200 dark:border-white/5'
              }`}>
                {msg.content.startsWith('http') ? (
                  msg.mode === 'video' 
                    ? <video src={msg.content} controls className="rounded-xl max-w-full" />
                    : <img src={msg.content} alt="AI" className="rounded-xl max-w-full shadow-2xl" />
                ) : (
                  <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT AREA */}
      <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-white/50 dark:bg-black/30 backdrop-blur-xl">
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {(['chat', 'image', 'video', 'code'] as AIMode[]).map((t) => (
            <button 
              key={t} 
              onClick={() => setMode(t)} 
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                mode === t 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 scale-105' 
                : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-blue-500/10 hover:text-blue-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto flex items-center gap-3 bg-gray-50 dark:bg-[#151515] p-3 rounded-[2rem] border border-gray-200 dark:border-white/5 focus-within:border-blue-500/50 shadow-inner transition-all">
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())}
            placeholder={`Ask ${engineMap[mode].name}...`}
            className="flex-grow bg-transparent outline-none dark:text-white text-sm py-3 px-4 resize-none max-h-32"
            rows={1}
          />
          <button 
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-20 transition-all active:scale-90 shadow-lg shadow-blue-600/20"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}