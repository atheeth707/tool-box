import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Sparkles, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (error) {
      console.error(error);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="bg-[#0f0f0f] border border-white/10 p-8 rounded-3xl text-center max-w-md w-full">
        <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-6" />
        <h1 className="text-3xl font-black text-white mb-4 uppercase">AI TOOLBOX</h1>
        <p className="text-gray-400 mb-8 text-sm">Sign in to access 150+ tools</p>
        <button 
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          {isLoggingIn ? <Loader2 className="animate-spin" /> : "Continue with Google"}
        </button>
      </div>
    </div>
  );
}