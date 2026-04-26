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
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12 md:py-20 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 rounded-3xl">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
          All-in-One <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Free Tools</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
          Free online tools for developers, creators, and everyday users. Fast, secure, and no login required.
        </p>
        
        <div className="max-w-2xl mx-auto relative mt-8 px-4">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              placeholder="Search for tools (e.g., PDF converter, Image resizer...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:text-white transition-all shadow-lg shadow-blue-500/5"
            />
          </div>
          
          {/* Search Results Dropdown */}
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
                          <div className="text-sm text-gray-500 dark:text-gray-400">{tool.categories?.name}</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">No tools found matching "{searchQuery}"</div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Popular Tools */}
      {!searchQuery && (
        <section>
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
              <TrendingUp className="text-rose-600 dark:text-rose-400" size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Trending Tools</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map((tool: any) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {!searchQuery && (
        <section id="categories-section">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Grid className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Browse by Category</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((cat: any) => (
              <Link key={cat.id} to={`/category/${cat.id}`} className="group bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 duration-300 flex flex-col items-center text-center space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl group-hover:bg-blue-600 transition-colors duration-300">
                  <Icon name={cat.icon} className="w-10 h-10 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{cat.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{cat.description}</p>
                </div>
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
    <Link to={`/tool/${tool.id}`} className="group bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:border-blue-500/50 flex items-start space-x-4">
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
  );
}
