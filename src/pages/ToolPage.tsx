import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Icon } from '../components/Icon';
import { getToolComponent } from '../tools/ToolRegistry';

export default function ToolPage() {
  const { toolId } = useParams();
  const [tool, setTool] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!toolId) return;
    fetch(`/api/tool?id=${toolId}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setTool(data);
          // Increment views
          fetch('/api/tools', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: toolId })
          }).catch(console.error);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [toolId]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!tool) return (
    <div className="text-center py-20 text-xl text-gray-600 dark:text-gray-300 px-4">
      Tool not found
    </div>
  );

  const ToolComponent = getToolComponent(tool.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tool.name,
        text: tool.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    /* max-w-5xl ensures it doesn't get too wide on desktop; px-4 adds mobile breathing room */
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-10 px-4 sm:px-6 lg:px-8 py-4">
      
      {/* Adaptive Back Button */}
      <Link 
        to={tool.category_id ? `/category/${tool.category_id}` : '/'} 
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1.5" /> 
        <span>Back to {tool.category_id || 'Tools'}</span>
      </Link>

      {/* Hero Header Card: Adjusts padding and text size for mobile */}
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 md:p-14 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm text-center relative overflow-hidden">
        {/* Decorative Top Gradient Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        
        {/* Adaptive Icon Size */}
        <div className="inline-flex bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-6 rounded-2xl mb-6">
          <Icon name={tool.icon} className="w-10 h-10 sm:w-14 sm:h-14 text-blue-600 dark:text-blue-400" />
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
          {tool.name}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          {tool.description}
        </p>
        
        {/* Adaptive Stats and Share Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
          <div className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-5 py-2.5 rounded-full">
            {tool.views.toLocaleString()} uses
          </div>
          <button 
            onClick={handleShare} 
            className="w-full sm:w-auto flex items-center justify-center text-sm font-semibold text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 bg-gray-100 hover:bg-blue-50 dark:bg-gray-700 dark:hover:bg-gray-600 px-6 py-2.5 rounded-full transition-all active:scale-95"
          >
            <Share2 size={16} className="mr-2" /> Share Tool
          </button>
        </div>
      </div>

      {/* Main Tool Component Section */}
      <div className="py-2 sm:py-6">
        {/* We wrap ToolComponent to ensure any internal Iframes or wide tables scale correctly */}
        <div className="w-full overflow-hidden">
          <ToolComponent />
        </div>
      </div>
    </div>
  );
}