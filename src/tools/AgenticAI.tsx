import React, { useState } from 'react';
import { Sparkles, BrainCircuit, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');

    try {
      // 1. Get current session and profile[cite: 11]
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please log in first.");

      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', session.user.id)
        .single();

      // 2. Check Credits[cite: 11]
      if (!profile || profile.credits < 1) {
        throw new Error("You have 0 credits. Please recharge in the Pricing section.");
      }

      // 3. Determine Complexity (Simple heuristic)
      const complexity = (prompt.length > 300 || prompt.toLowerCase().includes('code')) ? 'high' : 'standard';

      // 4. Call your SECURE Vercel API
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, complexity })
      });

      if (!res.ok) throw new Error("The AI Agent is currently overloaded. Try again in a moment.");

      const data = await res.json();
      setResponse(data.text);

      // 5. Only if successful, deduct 1 credit[cite: 11]
      await supabase
        .from('profiles')
        .update({ credits: profile.credits - 1 })
        .eq('id', session.user.id);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-purple-500/10 rounded-2xl">
            <BrainCircuit className="text-purple-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black dark:text-white uppercase tracking-tight">Agentic Router</h2>
            <p className="text-gray-500 text-sm">Smart model switching based on task complexity.</p>
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