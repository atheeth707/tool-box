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
    <div className="flex justify-center items-center min-h-[30vh] md:min-h-[50vh]">
      <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!tool) return <div className="text-center py-10 md:py-20 px-2 md:px-4 text-sm md:text-base">Tool not found</div>;

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
    <div className="max-w-5xl mx-auto space-y-3 md:space-y-10 px-2 sm:px-6 lg:px-8 py-2 md:py-4">
      <Link 
        to={tool.category_id ? `/category/${tool.category_id}` : '/'} 
        className="inline-flex items-center text-[11px] md:text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
      >
        <ArrowLeft size={14} className="mr-1 md:mr-1.5" /> 
        <span>Back</span>
      </Link>

      <div className="bg-white dark:bg-gray-800 p-4 sm:p-8 md:p-14 rounded-xl md:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 md:h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        
        <div className="inline-flex bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-6 rounded-lg md:rounded-2xl mb-3 md:mb-6">
          <Icon name={tool.icon} className="w-6 h-6 sm:w-14 sm:h-14 text-blue-600 dark:text-blue-400" />
        </div>
        
        <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-1.5 md:mb-4 leading-tight">
          {tool.name}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-[11px] sm:text-lg px-2">
          {tool.description}
        </p>
        
        <div className="flex flex-row items-center justify-center space-x-2 sm:space-x-4 mt-4 sm:mt-8">
          <div className="text-[10px] sm:text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full">
            {tool.views.toLocaleString()} uses
          </div>
          <button 
            onClick={handleShare} 
            className="flex items-center justify-center text-[10px] sm:text-sm font-semibold text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 bg-gray-100 hover:bg-blue-50 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-full transition-all"
          >
            <Share2 size={12} className="mr-1.5 sm:w-4 sm:h-4 sm:mr-2" /> Share
          </button>
        </div>
      </div>

      <div className="py-2 sm:py-6">
        <div className="w-full overflow-hidden">
          <ToolComponent />
        </div>
      </div>
    </div>
  );
}