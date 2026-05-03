import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, BrainCircuit, Loader2, AlertCircle, Lock, Coins } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [session, setSession] = useState<any>(null);
  const [credits, setCredits] = useState<number | null>(null);

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

  const handleGenerate = async () => {
    if (!prompt.trim() || !session || (credits !== null && credits < 1)) return;
    setLoading(true);
    setError('');

    try {
      const complexity = (prompt.length > 300 || prompt.toLowerCase().includes('code')) ? 'high' : 'standard';

      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, complexity })
      });

      if (!res.ok) throw new Error("The AI Agent is currently overloaded. Try again.");

      const data = await res.json();
      setResponse(data.text);

      // Deduct credit after successful generation
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .update({ credits: credits! - 1 })
        .eq('id', session.user.id)
        .select()
        .single();
      
      if (updatedProfile) setCredits(updatedProfile.credits);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // LOCK SCREEN: If not logged in OR credits are 0
  if (!session || (credits !== null && credits < 1)) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-10 bg-white dark:bg-[#0f0f0f] border border-blue-500/20 rounded-3xl text-center shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="inline-flex p-4 bg-blue-500/10 rounded-2xl mb-6">
          <Lock className="w-10 h-10 text-blue-500" />
        </div>
        <h2 className="text-3xl font-black dark:text-white mb-4 uppercase tracking-tighter">Premium Agentic AI</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          This advanced tool requires credits to run. {!session ? "Please log in to continue." : "You've run out of credits."}
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

  // ACTIVE TOOL: Only shown if logged in AND has credits[cite: 18]
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl">
              <BrainCircuit className="text-purple-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black dark:text-white uppercase tracking-tight">Agentic Router</h2>
              <p className="text-gray-500 text-sm">Credits remaining: {credits}</p>
            </div>
          </div>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your request here..."
          className="w-full h-40 p-5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white resize-none mb-4"
        />

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm mb-4 bg-red-500/10 p-3 rounded-xl">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
          {loading ? 'AGENT THINKING...' : 'RUN AGENT (1 CREDIT)'}
        </button>
      </div>

      {response && (
        <div className="bg-white dark:bg-[#0f0f0f] border border-blue-500/20 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-xs font-black text-blue-500 mb-4 tracking-widest uppercase">Agent Response</div>
          <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed">
            {response}
          </div>
        </div>
      )}
    </div>
  );
}