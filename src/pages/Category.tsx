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

  if (loading) return <div className="flex justify-center p-6 md:p-12"><div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-600"></div></div>;
  if (!category) return <div className="text-center py-6 md:py-12 dark:text-white">Category not found</div>;

  return (
    <div className="space-y-3 md:space-y-6">
      <Link to="/" className="inline-flex items-center text-[10px] md:text-sm text-gray-500 hover:text-blue-600 transition-colors">
        <ArrowLeft size={12} className="mr-1 md:w-[14px] md:h-[14px]" /> Back to Home
      </Link>

      <div className="flex items-center space-x-2 md:space-x-4 bg-white dark:bg-gray-800 p-3 md:p-8 rounded-xl md:rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 md:p-5 rounded-lg md:rounded-xl">
          <Icon name={category.icon} className="w-5 h-5 md:w-10 md:h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-lg md:text-4xl font-bold dark:text-white leading-tight">{category.name}</h1>
          <p className="text-[10px] md:text-lg text-gray-500 line-clamp-1 mt-0.5 md:mt-1">{category.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
        {tools.map((tool: any) => (
          <Link key={tool.id} to={`/tool/${tool.id}`} className="group bg-white dark:bg-gray-800 p-2 md:p-6 rounded-lg md:rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-1 md:space-y-0 md:space-x-4 transition-all hover:border-blue-500/50">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-1.5 md:p-4 rounded-md md:rounded-lg shrink-0 group-hover:bg-blue-50 transition-colors">
              <Icon name={tool.icon} className="w-4 h-4 md:w-6 md:h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600" />
            </div>
            <div className="min-w-0 w-full">
              <h3 className="font-semibold text-[11px] md:text-base dark:text-white line-clamp-1">{tool.name}</h3>
              <p className="hidden md:block text-sm text-gray-500 mt-1 line-clamp-2">{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}