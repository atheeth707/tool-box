import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { supabase } from '../supabaseClient';

export default function Layout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // CRITICAL: Safety timeout to prevent permanent white screen
    const timeout = setTimeout(() => {
      console.warn("Auth initialization timed out. Rendering app anyway.");
      setLoading(false);
    }, 5000);

    const initAuth = async () => {
      try {
        // Fetch current session to sync Navbar states
        await supabase.auth.getSession();
      } catch (err) {
        console.error("Supabase Session Error:", err);
      } finally {
        setLoading(false);
        clearTimeout(timeout);
      }
    };

    initAuth();

    // Listen for auth state changes (login/logout)
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
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] animate-pulse">
          Initializing AI Toolbox
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#050505] transition-colors duration-200">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Child routes like Home, Category, and ToolPage render here[cite: 57] */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}