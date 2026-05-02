import React from 'react';
import { supabase } from '../supabaseClient';
import { Sparkles, Zap, Shield } from 'lucide-react';

export default function AuthPage() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) console.error('Login error:', error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="p-8 text-center relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Welcome to ToolBox</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Sign in to access 160+ premium AI tools and claim your 5 free credits.</p>

          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="mt-8 grid grid-cols-2 gap-4 text-left">
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Agentic AI Routing</span>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Secure Cloud Saves</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}