import { useNavigate } from 'react-router-dom';
import { Send, Paperclip, Sparkles } from 'lucide-react';

// Inside your Home component...
const navigate = useNavigate();

return (
  <div className="space-y-16">
    <section className="pt-10 flex flex-col items-center text-center">
      <h1 className="text-4xl md:text-6xl font-black dark:text-white mb-6 uppercase tracking-tighter">
        Build with <span className="text-blue-600">Agentic AI</span>
      </h1>
      
      {/* MOCK CHAT UI REDIRECT */}
      <div 
        onClick={() => navigate('/agent')}
        className="w-full max-w-3xl bg-white dark:bg-[#0f0f0f] border-2 border-gray-100 dark:border-white/10 p-4 rounded-3xl shadow-2xl cursor-pointer hover:border-blue-500/50 transition-all group"
      >
        <div className="flex items-center gap-3">
          <Paperclip className="text-gray-400 ml-2" size={22} />
          <div className="flex-grow text-left py-3 text-gray-400 text-lg">Message the Agentic AI...</div>
          <div className="bg-blue-600 p-3 rounded-2xl text-white"><Send size={20} /></div>
        </div>
      </div>
    </section>
    
    {/* Existing Tools/Categories section follows here */}
  </div>
);