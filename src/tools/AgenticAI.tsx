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
  
  // File Upload State
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
    };
    checkAuth();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !session || (credits !== null && credits < 1)) return;
    setLoading(true);
    setError('');
    setResponse(''); // Clear previous response

    try {
      // 1. Prepare FormData for Multimodal Uploads
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('mode', mode);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      // 2. Call the unified API (Note: Browser automatically sets Content-Type for FormData)
      const res = await fetch('/api/agent', {
        method: 'POST',
        body: formData 
      });

      if (!res.ok) throw new Error(`${mode.toUpperCase()} generation failed. The AI Agent is currently overloaded.`);

      const data = await res.json();
      setResponse(data.text || data.url); // Support text responses or generated media URLs

      // 3. Deduct credit
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .update({ credits: credits! - 1 })
        .eq('id', session.user.id)
        .select()
        .single();
      
      if (updatedProfile) setCredits(updatedProfile.credits);
      
      // 4. Clear inputs after success
      setPrompt('');
      removeFile();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // LOCK SCREEN (Not Logged In / 0 Credits)
  // ------------------------------------------------------------------
  if (!session || (credits !== null && credits < 1)) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-10 bg-white dark:bg-[#0f0f0f] border border-blue-500/20 rounded-3xl text-center shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="inline-flex p-4 bg-blue-500/10 rounded-2xl mb-6">
          <Lock className="w-10 h-10 text-blue-500" />
        </div>
        <h2 className="text-3xl font-black dark:text-white mb-4 uppercase tracking-tighter">Premium Agentic AI</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Upload files, analyze data, and generate Video, Image, and Code. {!session ? "Please log in to continue." : "You've run out of credits."}
        </p>
        <div className="flex flex-col gap-4">
          <Link to="/pricing" className="py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
            <Coins size={18} /> GET CREDITS
          </Link>
          {!session && (
            <p className="text-sm text-gray-500">
              Sign in via the <b>Continue with Google</b> button in the navbar.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // ACTIVE TOOL (Pro Multimodal Interface)
  // ------------------------------------------------------------------
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Mode Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl">
            <BrainCircuit className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black dark:text-white uppercase tracking-tight">Multimodal Studio</h2>
            <p className="text-gray-500 text-sm font-bold flex items-center gap-1">
              <Coins size={14} className="text-yellow-500"/> {credits} Credits Available
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl w-full md:w-auto overflow-x-auto">
          {[
            { id: 'chat', icon: <MessageSquare size={16} />, label: 'Chat' },
            { id: 'image', icon: <ImageIcon size={16} />, label: 'Image' },
            { id: 'video', icon: <Video size={16} />, label: 'Video' },
            { id: 'code', icon: <Code size={16} />, label: 'Code' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as AIMode)}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                mode === tab.id 
                  ? 'bg-white dark:bg-[#1a1a1a] text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-white/10' 
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white border border-transparent'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Response Area (Shows if there is a response) */}
      {response && (
        <div className="bg-white dark:bg-[#0f0f0f] border border-blue-500/20 rounded-3xl p-6 md:p-8 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 text-xs font-black text-blue-500 mb-6 tracking-widest uppercase border-b border-blue-500/10 pb-4">
            <Sparkles size={14} /> Agent Output
          </div>
          <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed text-lg">
            {/* If response is a URL (like an image/video), render it. Otherwise render text. */}
            {response.startsWith('http') ? (
              mode === 'video' ? (
                <video src={response} controls className="w-full rounded-2xl shadow-md" />
              ) : (
                <img src={response} alt="Generated AI" className="w-full rounded-2xl shadow-md" />
              )
            ) : (
              <p className="whitespace-pre-wrap">{response}</p>
            )}
          </div>
        </div>
      )}

      {/* Modern Input Area (ChatGPT Style) */}
      <div className="bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-white/10 rounded-3xl p-4 shadow-xl focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
        
        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm mb-4 bg-red-500/10 p-3 rounded-xl animate-in fade-in">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* File Preview Chip */}
        {selectedFile && (
          <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 p-3 rounded-xl w-fit mb-4 animate-in zoom-in">
            <div className="p-2 bg-blue-500 text-white rounded-lg">
              <FileText size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px]">
                {selectedFile.name}
              </span>
              <span className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <button onClick={removeFile} className="p-1 text-gray-400 hover:text-red-500 ml-2 transition-colors">
              <X size={16} />
            </button>
          </div>
        )}

        <div className="flex items-end gap-3 relative">
          
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
          />
          
          {/* Attachment Button */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-4 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-2xl transition-all shrink-0"
            title="Attach File"
          >
            <Paperclip size={24} />
          </button>

          {/* Text Area */}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            placeholder={`Message ${mode.charAt(0).toUpperCase() + mode.slice(1)} Agent... (Press Enter to send)`}
            className="w-full max-h-60 min-h-[60px] p-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-2xl outline-none dark:text-white resize-y text-lg"
          />

          {/* Submit Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className={`p-4 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
              loading || !prompt.trim() 
                ? 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95'
            }`}
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
          </button>
        </div>
        
        {/* Footnote */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-400 font-medium">
            AI can make mistakes. Check important info. Generates cost 1 credit.
          </p>
        </div>
      </div>

    </div>
  );
}