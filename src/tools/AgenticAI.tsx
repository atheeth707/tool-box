import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, BrainCircuit, Loader2, AlertCircle, Lock, 
  Coins, Image as ImageIcon, Video, Code, MessageSquare, 
  Paperclip, X, Send, FileText, UserPlus
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

      const res = await fetch('/api/agent', { method: 'POST', body: formData });
      if (!res.ok) throw new Error(`${mode.toUpperCase()} failed. Agent overloaded.`);

      const data = await res.json();
      setResponse(data.text || data.url);
      
      // Update local credits after successful generation
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      </div>
    );
  }

  // 1. Logic for Guest Users (No Session)
  if (!session) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-10 bg-white dark:bg-[#0f0f0f] border border-blue-500/20 rounded-3xl text-center shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="inline-flex p-4 bg-blue-500/10 rounded-2xl mb-6">
          <UserPlus className="w-10 h-10 text-blue-500" />
        </div>
        <h2 className="text-3xl font-black dark:text-white mb-2 uppercase tracking-tighter">Login Required</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Please login to access our premium Agentic AI tools and claim your free credits.</p>
        <Link 
          to="/auth" 
          className="py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          CONTINUE TO LOGIN
        </Link>
      </div>
    );
  }

  // 2. Logic for Logged-in Users with No Credits
  if (credits !== null && credits < 1) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-10 bg-white dark:bg-[#0f0f0f] border border-yellow-500/20 rounded-3xl text-center shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="inline-flex p-4 bg-yellow-500/10 rounded-2xl mb-6">
          <Lock className="w-10 h-10 text-yellow-500" />
        </div>
        <h2 className="text-3xl font-black dark:text-white mb-2 uppercase tracking-tighter">Out of Credits</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">You've used all your AI credits. Recharge now to continue generating image, video, and code.</p>
        <Link 
          to="/pricing" 
          className="py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-black rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Coins size={18} /> GET MORE CREDITS
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
      {/* 3. Generated Result Display */}
      {response && (
        <div className="bg-white dark:bg-[#0f0f0f] border-2 border-blue-500/20 rounded-3xl p-6 shadow-xl animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-black text-blue-500 tracking-widest uppercase">
              <Sparkles size={14} /> Generated Result ({mode})
            </div>
            <button onClick={() => setResponse('')} className="text-gray-400 hover:text-red-500 transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="flex justify-center bg-gray-50 dark:bg-black/20 rounded-2xl p-2 overflow-hidden">
            {response.startsWith('http') ? (
              mode === 'video' ? (
                <video src={response} controls className="max-w-full rounded-xl shadow-lg" />
              ) : (
                <img src={response} alt="AI Generated" className="max-w-full rounded-xl shadow-lg" />
              )
            ) : (
              <div className="w-full">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-200 dark:bg-white/5 rounded-t-xl border-b border-white/10">
                   <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{mode} output</span>
                </div>
                <pre className="whitespace-pre-wrap dark:text-white p-6 text-sm font-mono bg-black/40 rounded-b-xl overflow-x-auto">
                  {response}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. AI Input UI */}
      <div className="bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black dark:text-white uppercase tracking-tight">AI Studio</h2>
          </div>
          <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl overflow-x-auto w-full md:w-auto">
            {['chat', 'image', 'video', 'code'].map((t) => (
              <button 
                key={t} 
                onClick={() => setMode(t as AIMode)} 
                className={`flex-grow md:flex-initial px-6 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${
                  mode === t ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-blue-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 relative">
          {error && (
            <div className="text-red-500 text-sm mb-4 flex items-center gap-2 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
              <AlertCircle size={16}/>{error}
            </div>
          )}
          
          <div className="flex flex-col gap-3 bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-2xl border border-gray-200 dark:border-white/5 focus-within:border-blue-500/50 transition-colors">
            {selectedFile && (
              <div className="flex items-center justify-between bg-blue-500/10 p-2 rounded-xl border border-blue-500/20">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-500">
                  <FileText size={14} /> {selectedFile.name}
                </div>
                <button onClick={removeFile} className="text-blue-500 hover:text-red-500"><X size={14}/></button>
              </div>
            )}
            
            <div className="flex items-end gap-3">
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="p-3 text-gray-400 hover:text-blue-500 transition-colors bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5"
              >
                <Paperclip size={24}/>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
              
              <textarea 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder={`Describe your ${mode} request...`} 
                className="w-full bg-transparent outline-none dark:text-white resize-none text-lg min-h-[60px] py-2" 
              />
              
              <button 
                onClick={handleGenerate} 
                disabled={loading || !prompt.trim()} 
                className="bg-blue-600 p-4 rounded-2xl text-white disabled:opacity-50 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Send className="w-6 h-6" />}
              </button>
            </div>
          </div>
          
          <div className="mt-3 flex items-center justify-between px-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Available Credits: <span className={credits! < 3 ? "text-red-500" : "text-blue-500"}>{credits}</span>
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              1 Generation = 1 Credit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}