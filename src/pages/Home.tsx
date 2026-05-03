import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Send, Paperclip, Sparkles, ImageIcon, Video, ChevronRight } from 'lucide-react';
import { Icon } from '../components/Icon'; // Ensure this path is correct

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch your original categories and tools on load
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleInitialChatClick = () => {
    // Redirect to the dedicated AI screen
    navigate('/agent');
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      
      {/* 1. AI CHAT UI (TOP SECTION)[cite: 33] */}
      <section className="relative pt-6 pb-10 flex flex-col items-center">
        <div className="text-center mb-8 space-y-3">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">
            TOOL<span className="text-blue-600">BOX</span> AI
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Everything you need, powered by Agentic AI.
          </p>
        </div>

        {/* Clickable Chat Bar[cite: 33] */}
        <div 
          onClick={handleInitialChatClick}
          className="w-full max-w-3xl bg-white dark:bg-[#0f0f0f] border-2 border-gray-100 dark:border-white/10 p-4 rounded-3xl shadow-2xl cursor-text hover:border-blue-500/50 transition-all group"
        >
          <div className="flex items-end gap-3">
            <div className="p-3 text-gray-400"><Paperclip size={22} /></div>
            <div className="flex-grow py-3 text-gray-400 text-lg font-medium">Message the Agentic AI...</div>
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Send size={22} />
            </div>
          </div>
          
          <div className="flex gap-2 mt-4 ml-2">
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-full text-[10px] font-black text-gray-500 border border-gray-100 dark:border-white/5 uppercase tracking-wider">
                <ImageIcon size={12} className="text-purple-500"/> Image
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-full text-[10px] font-black text-gray-500 border border-gray-100 dark:border-white/5 uppercase tracking-wider">
                <Video size={12} className="text-pink-500"/> Video
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-full text-[10px] font-black text-gray-500 border border-gray-100 dark:border-white/5 uppercase tracking-wider">
                <Sparkles size={12} className="text-blue-500"/> Agentic
             </div>
          </div>
        </div>
      </section>

      {/* 2. OLD STYLE TOOLS/CATEGORIES (BOTTOM SECTION)[cite: 32] */}
      <section id="categories-section" className="space-y-8">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
          <h2 className="text-2xl font-black dark:text-white uppercase tracking-tight">Explore Categories</h2>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full uppercase">150+ Tools</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category: any) => (
              <Link 
                key={category.id} 
                to={`/category/${category.id}`}
                className="group bg-white dark:bg-[#0f0f0f] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:border-blue-500/20 transition-all flex items-center gap-5"
              >
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon name={category.icon} className="w-8 h-8" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-black dark:text-white uppercase text-lg tracking-tight group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{category.description}</p>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-blue-600 transition-all group-hover:translate-x-1" size={20} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}