import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, BrainCircuit, Loader2, AlertCircle, Lock, 
  Coins, Image as ImageIcon, Video, Code, MessageSquare, 
  Paperclip, X, Send, FileText, UserPlus, Cpu, Zap
} from 'lucide-react';
import { supabase } from '../supabaseClient';

type AIMode = 'chat' | 'image' | 'video' | 'code';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<AIMode>('chat');
  const [session, setSession] = useState<any>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Model mapping for UI transparency
  const modelInfo = {
    chat: { name: "Gemini 2.0 Ultra", icon: <MessageSquare size={14}/>, color: "text-blue-500" },
    image: { name: "Nano Banana 2", icon: <ImageIcon size={14}/>, color: "text-purple-500" },
    video: { name: "Veo Pro", icon: <Video size={14}/>, color: "text-pink-500" },
    code: { name: "Gemini 3 Flash", icon: <Code size={14}/>, color: "text-emerald-500" }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', session.user.id)
          .single();
        if (profile) setCredits(profile.credits);
      }
      setAuthLoading(false);
    };
    checkAuth();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !session || (credits !== null && credits < 1)) return;
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('mode', mode);
      if (selectedFile) formData.append('file', selectedFile);

      // Increased timeout handling for high-level models
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 60000); // 60s timeout

      const res = await fetch('/api/agent', { 
        method: 'POST', 
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(id);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Elite ${mode} model is temporarily congested. Try again in 10s.`);
      }

      const data = await res.json();
      setResponse(data.text || data.url);
      
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .update({ credits: credits! - 1 })
        .eq('id', session.user.id)
        .select()
        .single();
        
      if (updatedProfile) setCredits(updatedProfile.credits);
      setPrompt('');
      removeFile();
    } catch (err: any) {
      setError(err.name === 'AbortError' ? "Request timed out. The AI model is taking longer than usual." : err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12 mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-gray-500">Waking up Agentic models...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-12 bg-white dark:bg-[#0a0a0a] border border-blue-500/20 rounded-[2rem] text-center shadow-2xl">
        <div className="inline-flex p-5 bg-blue-500/10 rounded-3xl mb-6">
          <UserPlus className="w-10 h-10 text-blue-500" />
        </div>
        <h2 className="text-4xl font-black dark:text-white mb-3 uppercase tracking-tighter">Identity Required</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg">Access our elite suite of AI models. New users get 5 free credits.</p>
        <Link 
          to="/auth" 
          className="py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-500/20"
        >
          GET STARTED NOW
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-700">
      
      {/* 1. MODEL STATUS BAR */}
      <div className="flex items-center justify-between bg-white dark:bg-[#0f0f0f] p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Systems: Online</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Cpu size={14} className="text-blue-500" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Engines: {modelInfo[mode].name}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20">
          <Zap size={14} className="text-yellow-500" />
          <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter">Credits: {credits}</span>
        </div>
      </div>

      {/* 2. GENERATED OUTPUT */}
      {response && (
        <div className="bg-white dark:bg-[#0f0f0f] border-2 border-blue-500/20 rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-500 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${modelInfo[mode].color}`}>
              {modelInfo[mode].icon} Output from {modelInfo[mode].name}
            </div>
            <button onClick={() => setResponse('')} className="p-2 hover:bg-red-500/10 rounded-full text-gray-400 hover:text-red-500 transition-all">
              <X size={20} />
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-black/40 rounded-3xl p-4 overflow-hidden border border-white/5">
            {response.startsWith('http') ? (
              mode === 'video' ? (
                <video src={response} controls className="w-full rounded-2xl shadow-2xl aspect-video" />
              ) : (
                <img src={response} alt="AI Result" className="w-full rounded-2xl shadow-2xl" />
              )
            ) : (
              <pre className="whitespace-pre-wrap dark:text-gray-200 text-sm font-mono leading-relaxed max-h-[500px] overflow-y-auto custom-scrollbar">
                {response}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* 3. PRO STUDIO INPUT */}
      <div className="bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="space-y-1">
            <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter flex items-center gap-3">
              <BrainCircuit className="text-blue-600 w-8 h-8" />
              AI Studio <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-md ml-2">PRO</span>
            </h2>
            <p className="text-gray-500 text-sm font-medium ml-1">Powered by 3 elite model clusters.</p>
          </div>
          
          <div className="flex bg-gray-100 dark:bg-white/5 p-1.5 rounded-[1.25rem] w-full md:w-auto">
            {(['chat', 'image', 'video', 'code'] as AIMode[]).map((t) => (
              <button 
                key={t} 
                onClick={() => setMode(t)} 
                className={`flex-grow md:flex-initial px-6 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-[0.15em] ${
                  mode === t ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-md' : 'text-gray-500 hover:text-blue-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group">
          {error && (
            <div className="text-red-500 text-xs mb-6 flex items-center gap-3 bg-red-500/5 p-4 rounded-2xl border border-red-500/20 animate-shake">
              <AlertCircle size={18}/> {error}
            </div>
          )}
          
          <div className="bg-gray-50 dark:bg-[#151515] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 focus-within:border-blue-500/40 transition-all shadow-inner">
            {selectedFile && (
              <div className="flex items-center justify-between bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 mb-4 animate-in zoom-in">
                <div className="flex items-center gap-3 text-xs font-black text-blue-500 uppercase tracking-widest">
                  <FileText size={16} /> {selectedFile.name}
                </div>
                <button onClick={removeFile} className="text-blue-500 hover:text-red-500"><X size={16}/></button>
              </div>
            )}
            
            <div className="flex items-end gap-4">
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="p-4 text-gray-400 hover:text-blue-500 transition-all bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5 hover:scale-105 active:scale-95"
                title="Attach context file"
              >
                <Paperclip size={24}/>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
              
              <textarea 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder={`Tell the ${modelInfo[mode].name} what to create...`} 
                className="w-full bg-transparent outline-none dark:text-white resize-none text-lg min-h-[80px] py-2 placeholder:text-gray-300 dark:placeholder:text-gray-700" 
              />
              
              <button 
                onClick={handleGenerate} 
                disabled={loading || !prompt.trim()} 
                className="bg-blue-600 p-5 rounded-2xl text-white disabled:opacity-20 hover:bg-blue-700 shadow-2xl shadow-blue-600/40 transition-all active:scale-90 flex-shrink-0"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Send className="w-6 h-6" />}
              </button>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  <Sparkles size={10} className="text-yellow-500" /> Multi-Modal Active
               </div>
               <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  <Cpu size={10} className="text-blue-500" /> Low Latency
               </div>
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
               1 Generation = 1 Credit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}