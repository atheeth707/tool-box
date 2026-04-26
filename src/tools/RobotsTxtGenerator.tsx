import { useState } from 'react';
import { Copy, Bot } from 'lucide-react';

export default function RobotsTxtGenerator() {
  const [defaultRule, setDefaultRule] = useState('Allow');
  const [crawlDelay, setCrawlDelay] = useState('');
  const [sitemap, setSitemap] = useState('');
  const [rules, setRules] = useState([{ userAgent: 'Googlebot', rule: 'Disallow', directory: '/admin/' }]);

  const generate = () => {
    let out = [];
    
    // Default Rule
    out.push(`User-agent: *`);
    if (defaultRule === 'Disallow') {
      out.push(`Disallow: /`);
    } else {
      out.push(`Disallow: `);
    }
    
    if (crawlDelay) out.push(`Crawl-delay: ${crawlDelay}`);
    out.push('');

    // Specific Rules
    rules.forEach(r => {
      if (r.userAgent && r.directory) {
        out.push(`User-agent: ${r.userAgent}`);
        out.push(`${r.rule}: ${r.directory}`);
        out.push('');
      }
    });

    if (sitemap) {
      out.push(`Sitemap: ${sitemap}`);
    }

    return out.join('\n').trim();
  };

  const output = generate();

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <Bot className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Robots.txt Rules</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Default Access (*)</label>
            <select value={defaultRule} onChange={(e) => setDefaultRule(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none">
              <option value="Allow">Allow All Bots</option>
              <option value="Disallow">Disallow All Bots</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Crawl Delay (Seconds)</label>
            <input type="number" value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} placeholder="e.g. 10" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Sitemap URL</label>
          <input type="text" value={sitemap} onChange={(e) => setSitemap(e.target.value)} placeholder="https://example.com/sitemap.xml" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none" />
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold dark:text-white">Specific Bot Rules</h3>
            <button onClick={() => setRules([...rules, { userAgent: '', rule: 'Disallow', directory: '' }])} className="text-sm bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-lg font-bold">
              + Add Rule
            </button>
          </div>
          
          <div className="space-y-4">
            {rules.map((rule, idx) => (
              <div key={idx} className="flex gap-2 items-center bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                <input type="text" value={rule.userAgent} onChange={(e) => {const r = [...rules]; r[idx].userAgent = e.target.value; setRules(r);}} placeholder="Bot Name" className="flex-1 p-2 bg-white dark:bg-gray-800 rounded outline-none border border-gray-200 dark:border-gray-700 dark:text-white" />
                <select value={rule.rule} onChange={(e) => {const r = [...rules]; r[idx].rule = e.target.value; setRules(r);}} className="p-2 bg-white dark:bg-gray-800 rounded outline-none border border-gray-200 dark:border-gray-700 dark:text-white">
                  <option>Allow</option>
                  <option>Disallow</option>
                </select>
                <input type="text" value={rule.directory} onChange={(e) => {const r = [...rules]; r[idx].directory = e.target.value; setRules(r);}} placeholder="/path/" className="flex-1 p-2 bg-white dark:bg-gray-800 rounded outline-none border border-gray-200 dark:border-gray-700 dark:text-white" />
                <button onClick={() => setRules(rules.filter((_, i) => i !== idx))} className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded font-bold">X</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-800 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">robots.txt</h3>
          <button onClick={() => navigator.clipboard.writeText(output)} className="flex items-center text-sm bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Copy size={16} className="mr-2" /> Copy
          </button>
        </div>
        <textarea
          readOnly
          value={output}
          className="flex-1 w-full p-6 bg-gray-950 border border-gray-800 rounded-2xl text-blue-300 font-mono text-sm outline-none resize-none whitespace-pre"
        />
      </div>
    </div>
  );
}
