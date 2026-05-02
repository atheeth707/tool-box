import { Link } from 'react-router-dom';
import { Moon, Sun, Wrench, Coins, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Navbar() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [session, setSession] = useState<any>(null);
  const [credits, setCredits] = useState<number>(0);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchCredits(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchCredits(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCredits = async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('credits').eq('id', userId).single();
    if (data && !error) setCredits(data.credits);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 shadow-sm transition-colors">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
          <Wrench size={28} strokeWidth={2.5} />
          <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">ToolBox</span>
        </Link>
        
        <div className="flex items-center space-x-3 md:space-x-6">
          <button 
            onClick={() => setIsDark(!isDark)} 
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {session ? (
            <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800/50 p-1 pl-3 rounded-full border border-gray-200 dark:border-gray-700">
              {/* Credit Display & Top Up Link */}
              <Link to="/pricing" className="flex items-center space-x-1.5 cursor-pointer hover:opacity-80 transition-opacity" title="Top up Credits">
                <Coins size={16} className="text-yellow-500" />
                <span className="font-bold text-sm text-gray-800 dark:text-white">{credits}</span>
              </Link>
              
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-600"></div>
              
              <div className="flex items-center space-x-2 pr-1">
                <img 
                  src={session.user.user_metadata?.avatar_url || 'https://via.placeholder.com/150'} 
                  alt="Profile" 
                  className="w-7 h-7 rounded-full border border-blue-500"
                />
                <button onClick={handleLogout} className="p-1.5 text-gray-500 hover:text-red-500 transition-colors">
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
             <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Not Logged In</span>
          )}
        </div>
      </div>
    </nav>
  );
}