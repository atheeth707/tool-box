import { useState, useEffect } from 'react';[cite: 7]
import { useParams, Link } from 'react-router-dom';[cite: 7]
import { ArrowLeft, Share2 } from 'lucide-react';[cite: 7]
import { Icon } from '../components/Icon';[cite: 7]
import { getToolComponent } from '../tools/ToolRegistry';[cite: 7]

export default function ToolPage() {
  const { toolId } = useParams();[cite: 7]
  const [tool, setTool] = useState<any>(null);[cite: 7]
  const [loading, setLoading] = useState(true);[cite: 7]

  useEffect(() => {
    if (!toolId) return;
    fetch(`/api/tool?id=${toolId}`)[cite: 7]
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setTool(data);
          fetch('/api/tools', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: toolId }) }).catch(console.error);[cite: 7]
        }
        setLoading(false);[cite: 7]
      });
  }, [toolId]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );[cite: 7]

  if (!tool) return <div className="text-center py-20 px-4">Tool not found</div>;[cite: 7]

  const ToolComponent = getToolComponent(tool.id);[cite: 7]

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-10 px-4 sm:px-6 lg:px-8 py-4">[cite: 7]
      {/* Hero Header Card: Responsive padding and text */}
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 md:p-14 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm text-center relative overflow-hidden">[cite: 7]
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>[cite: 7]
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">{tool.name}</h1>[cite: 7]
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">{tool.description}</p>[cite: 7]
      </div>

      {/* Main Tool Component Section with Overflow protection */}
      <div className="py-2 sm:py-6">
        <div className="w-full overflow-hidden">
          <ToolComponent />[cite: 7]
        </div>
      </div>
    </div>
  );
}