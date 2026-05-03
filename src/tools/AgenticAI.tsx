import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, BrainCircuit, Loader2, AlertCircle, Lock, 
  Coins, Image as ImageIcon, Video, Code, MessageSquare, 
  Paperclip, X, Send, FileText
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        const { data: profile } = await supabase.from('profiles').select('credits').eq('id', session.user.id).single();
        if (profile) setCredits(profile.credits);
      }
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
      const { data: updatedProfile } = await supabase.from('profiles').update({ credits: credits! - 1 }).eq('id', session.user.id).select().single();
      if (updatedProfile) setCredits(updatedProfile.credits);
      setPrompt('');
      removeFile();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!session || (credits !== null && credits < 1)) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-10 bg-white dark:bg-[#0f0f0f] border border-blue-500/20 rounded-3xl text-center shadow-2xl">
        <div className="inline-flex p-4 bg-blue-500/10 rounded-2xl mb-6"><Lock className="w-10 h-10 text-blue-500" /></div>
        <h2 className="text-3xl font-black dark:text-white mb-4 uppercase tracking-tighter">Premium Agentic AI</h2>
        <Link to="/pricing" className="py-4 bg-blue-600 text-white font-black rounded-xl flex items-center justify-center gap-2 mt-4"><Coins size={18} /> GET CREDITS</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
      {/* 1. Show Generated Asset at the top after creation */}
      {response && (
        <div className="bg-white dark:bg-[#0f0f0f] border-2 border-blue-500/20 rounded-3xl p-6 shadow-xl animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 text-xs font-black text-blue-500 mb-4 tracking-widest uppercase"><Sparkles size={14} /> Generated Result</div>
          <div className="flex justify-center bg-gray-50 dark:bg-black/20 rounded-2xl p-2">
            {response.startsWith('http') ? (
              mode === 'video' ? <video src={response} controls className="max-w-full rounded-xl" /> : <img src={response} alt="AI Result" className="max-w-full rounded-xl" />
            ) : <p className="whitespace-pre-wrap dark:text-white p-4 text-lg">{response}</p>}
          </div>
        </div>
      )}

      {/* 2. Mode Selector and Input */}
      <div className="bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <BrainCircuit className="text-blue-500 w-8 h-8" />
            <h2 className="text-2xl font-black dark:text-white uppercase">AI Studio</h2>
          </div>
          <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl overflow-x-auto">
            {['chat', 'image', 'video', 'code'].map((t) => (
              <button key={t} onClick={() => setMode(t as AIMode)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${mode === t ? 'bg-white dark:bg-gray-800 text-blue-500 shadow-sm' : 'text-gray-500'}`}>{t.toUpperCase()}</button>
            ))}
          </div>
        </div>

        <div className="mt-8 relative focus-within:ring-2 ring-blue-500/50 rounded-2xl transition-all">
          {error && <div className="text-red-500 text-sm mb-4 flex items-center gap-2"><AlertCircle size={16}/>{error}</div>}
          <div className="flex items-end gap-3 bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-2xl border border-gray-200 dark:border-white/5">
            <button onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-400 hover:text-blue-500 transition-colors"><Paperclip size={24}/></button>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={`Message ${mode} Agent...`} className="w-full bg-transparent outline-none dark:text-white resize-none text-lg min-h-[50px]" />
            <button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="bg-blue-600 p-4 rounded-xl text-white disabled:opacity-50">{loading ? <Loader2 className="animate-spin" /> : <Send />}</button>
          </div>
        </div>
      </div>
    </div>
  );
}