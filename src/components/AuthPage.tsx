import React from 'react';
import { supabase } from '../supabaseClient';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function AuthPage() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6">
      <div className="relative group max-w-md w-full">
        {/* Animated Background Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        
        <div className="relative bg-[#0f0f0f] border border-white/10 p-8 rounded-3xl text-center shadow-2xl">
          <div className="mb-8 flex justify-center">
            <div className="p-4 bg-blue-500/10 rounded-2xl">
              <Sparkles className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">AI TOOLBOX</h1>
          <p className="text-gray-400 mb-8">Access 150+ agentic tools. Start with 5 free credits.</p>

          <button 
            onClick={handleLogin}
            className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all active:scale-95"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
            Continue with Google
          </button>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
              <ShieldCheck className="w-4 h-4 text-green-500" /> Secure Auth
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
              <Zap className="w-4 h-4 text-yellow-500" /> Instant Setup
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}