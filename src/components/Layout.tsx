import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AuthPage from './AuthPage';
import { supabase } from '../supabaseClient';

export default function Layout() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for an existing session on load[cite: 9]
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for auth state changes (Sign-in, Sign-out)[cite: 9]
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show a loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If no session exists, show the login page instead of the app[cite: 9]
  if (!session) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation remains at the top[cite: 13] */}
      <Navbar />
      
      {/* Main content area with standard padding[cite: 13] */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      {/* Footer remains at the bottom[cite: 13] */}
      <Footer />
    </div>
  );
}