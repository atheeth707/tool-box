import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Icon } from '../components/Icon';

export default function Category() {
  const { categoryId } = useParams();
  const [tools, setTools] = useState([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/categories`).then(res => res.json()),
      fetch(`/api/tools?category=${categoryId}`).then(res => res.json())
    ]).then(([cats, toolsData]) => {
      const currentCat = cats.find((c: any) => c.id === categoryId);
      setCategory(currentCat);
      setTools(toolsData);
      setLoading(false);
    });
  }, [categoryId]);

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (!category) return <div className="text-center py-12 text-xl text-gray-600 dark:text-gray-300">Category not found</div>;

  return (
    <div className="space-y-8">
      <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Back to Home
      </Link>

      <div className="flex items-center space-x-5 mb-8 bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-5 rounded-2xl">
          <Icon name={category.icon} className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{category.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">{category.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool: any) => (
          <Link key={tool.id} to={`/tool/${tool.id}`} className="group bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:border-blue-500/50 flex items-start space-x-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors shrink-0">
              <Icon name={tool.icon} className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{tool.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{tool.description}</p>
              {tool.status === 'coming_soon' && (
                <span className="inline-block mt-2 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-1 rounded">Coming Soon</span>
              )}
            </div>
          </Link>
        ))}
      </div>
      {tools.length === 0 && (
         <div className="text-center py-16 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
           No tools available in this category yet. Check back soon!
         </div>
      )}
    </div>
  );
}
