import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { supabase } from '../supabaseClient';

export default function Layout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We only check session to sync the Navbar profile/credits[cite: 15, 16]
    supabase.auth.getSession().then(() => {
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* All tools now render here for both guests and logged-in users[cite: 15, 17] */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}