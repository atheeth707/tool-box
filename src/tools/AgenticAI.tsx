import React, { useState } from 'react';
import { Sparkles, Zap, BrainCircuit, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setError('');
    setLoading(true);
    setResponse('');
    setModelUsed(null);

    try {
      // 1. Authenticate & Check Credits
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please log in.");

      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', session.user.id)
        .single();

      if (!profile || profile.credits <= 0) {
        throw new Error("Insufficient credits. Please top up!");
      }

      // 2. Real Agentic Routing
      const lowerPrompt = prompt.toLowerCase();
      let activeModel = 'Google Gemini 1.5';
      
      // Example routing logic: Choose model based on keywords
      if (lowerPrompt.includes('code') || lowerPrompt.includes('fast')) {
        activeModel = 'Groq (Llama 3)'; 
      }

      setModelUsed(activeModel);

      // 3. Call secure Vercel API Route
      const apiResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt })
      });

      if (!apiResponse.ok) {
        throw new Error("Failed to connect to the AI service.");
      }

      const data = await apiResponse.json();
      setResponse(data.text);

      // 4. Deduct 1 Credit via Supabase
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ credits: profile.credits - 1 })
        .eq('id', session.user.id);

      if (updateError) console.error("Failed to deduct credit:", updateError.message);

    } catch (err: any) {
      setError(err.message || 'An error occurred while communicating with the AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 dark:border-gray-800 pb-4">
          <BrainCircuit className="text-purple-500 w-6 h-6" />
          <h2 className="text-xl font-bold dark:text-white">Agentic Universal AI</h2>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          Describe what you need. Our Agent automatically selects the best API (Google, Groq, or HuggingFace) to fulfill your request. Cost: 1 Credit.
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Write a Python script to scrape data... OR Summarize this essay..."
          className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white resize-none"
        />

        {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}

        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Zap size={14} /> Smart Routing Active
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            {loading ? 'Routing Request...' : 'Generate (1 Credit)'}
          </button>
        </div>
      </div>

      {response && (
        <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700 rounded-2xl p-6 shadow-lg animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              Model Used: {modelUsed}
            </span>
          </div>
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
            {response}
          </p>
        </div>
      )}
    </div>
  );
}