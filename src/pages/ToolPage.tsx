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

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (!tool) return <div className="text-center py-12 text-xl text-gray-600 dark:text-gray-300">Tool not found</div>;

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
    <div className="max-w-4xl mx-auto space-y-8">
      <Link to={tool.category_id ? `/category/${tool.category_id}` : '/'} className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Back to {tool.category_id || 'Tools'}
      </Link>

      <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <div className="inline-flex bg-blue-50 dark:bg-blue-900/30 p-5 rounded-2xl mb-6">
          <Icon name={tool.icon} className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{tool.name}</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">{tool.description}</p>
        
        <div className="flex items-center justify-center space-x-4 mt-8">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
            {tool.views.toLocaleString()} uses
          </div>
          <button onClick={handleShare} className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 bg-gray-100 hover:bg-blue-50 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-full transition-colors">
            <Share2 size={16} className="mr-2" /> Share Tool
          </button>
        </div>
      </div>

      <div className="py-4">
        <ToolComponent />
      </div>
    </div>
  );
}
