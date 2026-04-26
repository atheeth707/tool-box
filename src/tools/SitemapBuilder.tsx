import { useState } from 'react';
import { Copy, Map } from 'lucide-react';

export default function SitemapBuilder() {
  const [urls, setUrls] = useState([{ loc: 'https://example.com/', lastmod: '', changefreq: 'daily', priority: '1.0' }]);

  const generate = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    urls.forEach(u => {
      if (!u.loc) return;
      xml += `  <url>\n`;
      xml += `    <loc>${u.loc}</loc>\n`;
      if (u.lastmod) xml += `    <lastmod>${u.lastmod}</lastmod>\n`;
      if (u.changefreq) xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
      if (u.priority) xml += `    <priority>${u.priority}</priority>\n`;
      xml += `  </url>\n`;
    });
    
    xml += `</urlset>`;
    return xml;
  };

  const output = generate();

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
              <Map className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold dark:text-white">URL List</h2>
          </div>
          <button onClick={() => setUrls([{ loc: '', lastmod: '', changefreq: 'monthly', priority: '0.5' }, ...urls])} className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold transition-colors">
            + Add URL
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 max-h-[600px] pr-2">
          {urls.map((u, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3 relative">
              <button onClick={() => setUrls(urls.filter((_, i) => i !== idx))} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">X</button>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL / Locator</label>
                <input type="text" value={u.loc} onChange={(e) => {const n = [...urls]; n[idx].loc = e.target.value; setUrls(n);}} placeholder="https://" className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none dark:text-white" />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Mod</label>
                  <input type="date" value={u.lastmod} onChange={(e) => {const n = [...urls]; n[idx].lastmod = e.target.value; setUrls(n);}} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none dark:text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Freq</label>
                  <select value={u.changefreq} onChange={(e) => {const n = [...urls]; n[idx].changefreq = e.target.value; setUrls(n);}} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none dark:text-white text-sm">
                    <option value="">None</option>
                    <option>always</option><option>hourly</option><option>daily</option><option>weekly</option><option>monthly</option><option>yearly</option><option>never</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Priority</label>
                  <input type="number" step="0.1" min="0" max="1" value={u.priority} onChange={(e) => {const n = [...urls]; n[idx].priority = e.target.value; setUrls(n);}} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none dark:text-white text-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-800 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">sitemap.xml</h3>
          <button onClick={() => navigator.clipboard.writeText(output)} className="flex items-center text-sm bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Copy size={16} className="mr-2" /> Copy
          </button>
        </div>
        <textarea
          readOnly
          value={output}
          className="flex-1 w-full p-6 bg-gray-950 border border-gray-800 rounded-2xl text-amber-300 font-mono text-sm outline-none resize-none whitespace-pre"
        />
      </div>
    </div>
  );
}
