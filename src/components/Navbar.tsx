import { Link } from 'react-router-dom';
import { Moon, Sun, Wrench, Coins, LogOut, PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, Profile } from '../supabaseClient'; // Ensure your types are in supabaseClient

export default function Navbar() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // 1. Theme Logic
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // 2. Profile and Auth Logic
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (!error) setProfile(data);
      }
    };

    fetchProfile();

    // Listen for credit updates or sign-ins
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      if (session) fetchProfile();
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <nav className="bg-white dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-white/5 sticky top-0 z-40 shadow-sm transition-colors">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
          <Wrench size={28} strokeWidth={2.5} />
          <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">ToolBox</span>
        </Link>
        
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Scroll to Tools[cite: 12] */}
          <button 
            onClick={() => {
              const el = document.getElementById('categories-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hidden md:block text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-bold text-sm transition-colors"
          >
            ALL TOOLS
          </button>

          {/* Theme Toggle[cite: 12] */}
          <button 
            onClick={() => setIsDark(!isDark)} 
            className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Authenticated User Section */}
          {profile ? (
            <div className="flex items-center gap-3 border-l border-gray-200 dark:border-white/10 pl-4 md:pl-6">
              {/* Credit Badge */}
              <Link to="/pricing" className="flex items-center gap-2 bg-yellow-500/10 dark:bg-yellow-500/5 px-3 py-1.5 rounded-full border border-yellow-500/20 hover:scale-105 transition-transform" title="Buy Credits">
                <Coins size={16} className="text-yellow-500" />
                <span className="font-bold text-sm text-gray-900 dark:text-white">{profile.credits}</span>
                <PlusCircle size={12} className="text-yellow-600" />
              </Link>
              
              {/* Profile Image & Logout */}
              <div className="flex items-center space-x-3">
                <img 
                  src={profile.avatar_url || 'https://via.placeholder.com/150'} 
                  alt="User Avatar" 
                  className="w-8 h-8 rounded-full border border-blue-500 ring-2 ring-blue-500/20"
                />
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
             <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Guest Mode</span>
          )}
        </div>
      </div>
    </nav>
  );
}