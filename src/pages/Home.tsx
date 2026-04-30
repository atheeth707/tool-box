import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Grid } from 'lucide-react';
import { Icon } from '../components/Icon';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [popularTools, setPopularTools] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(res => res.json()),
      fetch('/api/tools?popular=true&limit=6').then(res => res.json())
    ]).then(([cats, tools]) => {
      setCategories(cats);
      setPopularTools(tools);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (searchQuery.length > 1) {
      fetch(`/api/tools?search=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => setSearchResults(data));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-12 md:space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-10 md:py-20 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 rounded-3xl">
        <h1 className="text-3xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight px-2">
          All-in-One <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Free Tools</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-6">
          Fast, secure, and no login required.
        </p>
        
        <div className="max-w-2xl mx-auto relative mt-8 px-4">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-3.5 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-base focus:outline-none focus:border-blue-500 transition-all shadow-lg shadow-blue-500/5"
            />
          </div>
          
          {searchQuery.length > 1 && (
            <div className="absolute top-full left-4 right-4 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 text-left">
              {searchResults.length > 0 ? (
                <ul className="max-h-96 overflow-y-auto">
                  {searchResults.map((tool: any) => (
                    <li key={tool.id}>
                      <Link to={`/tool/${tool.id}`} className="flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-4">
                          <Icon name={tool.icon} className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{tool.name}</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center text-gray-500">No results.</div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Trending Tools - Responsive Grid */}
      {!searchQuery && (
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="text-rose-600" size={20} />
            <h2 className="text-xl md:text-3xl font-bold dark:text-white">Trending</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {popularTools.map((tool: any) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Categories - Compact Grid */}
      {!searchQuery && (
        <section id="categories-section">
          <div className="flex items-center space-x-3 mb-6">
            <Grid className="text-blue-600" size={20} />
            <h2 className="text-xl md:text-3xl font-bold dark:text-white">Categories</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {categories.map((cat: any) => (
              <Link key={cat.id} to={`/category/${cat.id}`} className="group bg-white dark:bg-gray-800 p-4 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 md:p-5 rounded-xl group-hover:bg-blue-600 transition-colors">
                  <Icon name={cat.icon} className="w-6 h-6 md:w-10 md:h-10 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                </div>
                <h3 className="font-semibold text-sm md:text-lg dark:text-white line-clamp-1">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ToolCard({ tool }: { tool: any }) {
  return (
    <Link to={`/tool/${tool.id}`} className="group bg-white dark:bg-gray-800 p-3 md:p-6 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-2 md:space-y-0 md:space-x-4">
      <div className="bg-gray-50 dark:bg-gray-700/50 p-2 md:p-4 rounded-lg shrink-0">
        <Icon name={tool.icon} className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-300" />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-xs md:text-base dark:text-white line-clamp-1">{tool.name}</h3>
        <p className="hidden md:block text-sm text-gray-500 mt-1 line-clamp-1">{tool.description}</p>
      </div>
    </Link>
  );
}