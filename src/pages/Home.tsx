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

  if (loading) return <div className="flex justify-center p-6 md:p-12"><div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6 md:space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-3 md:space-y-6 py-6 md:py-20 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 rounded-xl md:rounded-3xl">
        <h1 className="text-2xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight px-2 leading-tight">
          All-in-One <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Free Tools</span>
        </h1>
        <p className="text-xs md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4 md:px-6">
          Fast, secure, and no login required.
        </p>
        
        <div className="max-w-2xl mx-auto relative mt-4 md:mt-8 px-2 md:px-4">
          <div className="relative">
            <Search className="absolute left-3 md:left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 md:pl-14 pr-3 md:pr-6 py-2 md:py-3.5 rounded-full border border-gray-200 md:border-2 dark:border-gray-700 bg-white dark:bg-gray-800 text-[11px] md:text-base focus:outline-none focus:border-blue-500 transition-all shadow-sm md:shadow-lg shadow-blue-500/5"
            />
          </div>
          
          {searchQuery.length > 1 && (
            <div className="absolute top-full left-2 right-2 md:left-4 md:right-4 mt-1 md:mt-2 bg-white dark:bg-gray-800 rounded-lg md:rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 text-left">
              {searchResults.length > 0 ? (
                <ul className="max-h-60 md:max-h-96 overflow-y-auto">
                  {searchResults.map((tool: any) => (
                    <li key={tool.id}>
                      <Link to={`/tool/${tool.id}`} className="flex items-center px-3 py-2 md:px-6 md:py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 md:p-2 rounded md:rounded-lg mr-2 md:mr-4">
                          <Icon name={tool.icon} className="w-3 h-3 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium text-[11px] md:text-base text-gray-900 dark:text-white">{tool.name}</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-3 md:p-6 text-center text-[11px] md:text-base text-gray-500">No results.</div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Trending Tools */}
      {!searchQuery && (
        <section>
          <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-6">
            <TrendingUp className="text-rose-600 w-4 h-4 md:w-5 md:h-5" />
            <h2 className="text-sm md:text-3xl font-bold dark:text-white">Trending</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
            {popularTools.map((tool: any) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {!searchQuery && (
        <section id="categories-section">
          <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-6">
            <Grid className="text-blue-600 w-4 h-4 md:w-5 md:h-5" />
            <h2 className="text-sm md:text-3xl font-bold dark:text-white">Categories</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
            {categories.map((cat: any) => (
              <Link key={cat.id} to={`/category/${cat.id}`} className="group bg-white dark:bg-gray-800 p-2 md:p-8 rounded-lg md:rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center space-y-1.5 md:space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 md:p-5 rounded-lg md:rounded-xl group-hover:bg-blue-600 transition-colors">
                  <Icon name={cat.icon} className="w-5 h-5 md:w-10 md:h-10 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                </div>
                <h3 className="font-semibold text-[11px] md:text-lg dark:text-white line-clamp-1">{cat.name}</h3>
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
    <Link to={`/tool/${tool.id}`} className="group bg-white dark:bg-gray-800 p-2 md:p-6 rounded-lg md:rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-1 md:space-y-0 md:space-x-4">
      <div className="bg-gray-50 dark:bg-gray-700/50 p-1.5 md:p-4 rounded-md md:rounded-lg shrink-0">
        <Icon name={tool.icon} className="w-4 h-4 md:w-6 md:h-6 text-gray-600 dark:text-gray-300" />
      </div>
      <div className="min-w-0 w-full">
        <h3 className="font-semibold text-[11px] md:text-base dark:text-white line-clamp-1">{tool.name}</h3>
        <p className="hidden md:block text-sm text-gray-500 mt-1 line-clamp-1">{tool.description}</p>
      </div>
    </Link>
  );
}