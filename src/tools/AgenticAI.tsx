import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, BrainCircuit, Loader2, AlertCircle, 
  Coins, Image as ImageIcon, Video, Code, MessageSquare, 
  Paperclip, X, Send, FileText, UserPlus, Cpu, User, Bot
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages update
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
      
      // Update credits
      const { data: profile } = await supabase.from('profiles').update({ credits: credits! - 1 }).eq('id', session.user.id).select().single();
      if (profile) setCredits(profile.credits);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><Loader2 className="animate-spin text-blue-500 w-12 h-12" /></div>;

  if (!session) return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-[#0f0f0f] border border-white/10 rounded-[2rem] text-center shadow-2xl">
      <UserPlus className="w-12 h-12 text-blue-500 mx-auto mb-6" />
      <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Login to Start Chatting</h2>
      <Link to="/auth" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl flex items-center justify-center transition-all">SIGN IN</Link>
    </div>
  );

  return (
    <div className="flex flex-col h-[85vh] max-w-5xl mx-auto bg-white dark:bg-[#050505] rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden animate-in fade-in duration-500">
      
      {/* 1. TOP HEADER STATUS */}
      <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg"><BrainCircuit className="text-blue-500 w-5 h-5" /></div>
          <div>
            <h2 className="text-sm font-black dark:text-white uppercase tracking-widest">AI Studio Pro</h2>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Active Engine: Gemini 2.0 Ultra</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20">
            <span className="text-[10px] font-black text-yellow-600 uppercase">Credits: {credits}</span>
          </div>
        </div>
      </div>

      {/* 2. CHAT THREAD (ChatGPT Style) */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <Sparkles className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-black dark:text-white uppercase">How can I help you today?</h3>
            <p className="text-sm text-gray-500 mt-2">Choose a mode below to start generating.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar Icons */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-800 border border-white/10'}`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-blue-400" />}
              </div>

              {/* Message Bubble */}
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-gray-100 dark:bg-[#1a1a1a] dark:text-gray-200 rounded-tl-none border border-gray-200 dark:border-white/5'
              }`}>
                {msg.content.startsWith('http') ? (
                  msg.mode === 'video' 
                    ? <video src={msg.content} controls className="rounded-xl max-w-full" />
                    : <img src={msg.content} alt="AI" className="rounded-xl max-w-full shadow-lg" />
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}
                <div className={`text-[9px] mt-2 font-bold opacity-50 uppercase ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {msg.mode} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center"><Loader2 size={16} className="animate-spin text-blue-500" /></div>
              <div className="p-4 bg-gray-100 dark:bg-[#1a1a1a] rounded-2xl rounded-tl-none border border-white/5">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. INPUT AREA */}
      <div className="p-4 md:p-6 border-t border-gray-100 dark:border-white/5 bg-white/50 dark:bg-black/20">
        {error && <div className="mb-4 text-xs text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</div>}
        
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {(['chat', 'image', 'video', 'code'] as AIMode[]).map((t) => (
            <button 
              key={t} 
              onClick={() => setMode(t)} 
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                mode === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-blue-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto flex items-center gap-2 bg-gray-50 dark:bg-[#151515] p-2 rounded-2xl border border-gray-200 dark:border-white/10 focus-within:border-blue-500/50 transition-all">
          <button className="p-3 text-gray-400 hover:text-blue-500"><Paperclip size={20} /></button>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())}
            placeholder={`Message AI (${mode})...`}
            className="flex-grow bg-transparent outline-none dark:text-white text-sm py-2 resize-none max-h-32"
            rows={1}
          />
          <button 
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-20 transition-all active:scale-90"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}