import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { supabase } from '../supabaseClient';

export default function Layout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety timeout: If Supabase doesn't respond in 5s, stop loading to avoid white screen
    const timeout = setTimeout(() => setLoading(false), 5000);

    const initAuth = async () => {
      try {
        await supabase.auth.getSession();
      } catch (err) {
        console.error("Supabase Session Error:", err);
      } finally {
        setLoading(false);
        clearTimeout(timeout);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setLoading(false);
      clearTimeout(timeout);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest animate-pulse">Initializing Toolbox...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}