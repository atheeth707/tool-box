import { useState } from 'react';
import { Copy, Link2 } from 'lucide-react';

export default function UtmBuilder() {
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');

  const buildUrl = () => {
    if (!url) return '';
    try {
      const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
      if (source) parsedUrl.searchParams.set('utm_source', source);
      if (medium) parsedUrl.searchParams.set('utm_medium', medium);
      if (campaign) parsedUrl.searchParams.set('utm_campaign', campaign);
      if (term) parsedUrl.searchParams.set('utm_term', term);
      if (content) parsedUrl.searchParams.set('utm_content', content);
      return parsedUrl.toString();
    } catch (e) {
      return 'Invalid URL';
    }
  };

  const finalUrl = buildUrl();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <Link2 className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">UTM Builder</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Website URL *</label>
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Campaign Source *</label>
            <input type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. google, newsletter" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Campaign Medium</label>
            <input type="text" value={medium} onChange={(e) => setMedium(e.target.value)} placeholder="e.g. cpc, banner, email" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Campaign Name</label>
            <input type="text" value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="e.g. spring_sale" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Campaign Term</label>
            <input type="text" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Identify paid keywords" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Campaign Content</label>
            <input type="text" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Use to differentiate ads" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 relative">
          <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Generated UTM URL</label>
          <textarea
            readOnly
            value={finalUrl}
            className="w-full h-24 bg-transparent border-none outline-none dark:text-white resize-none break-all font-mono text-blue-600 dark:text-blue-400"
            placeholder="Your generated URL will appear here..."
          />
          {finalUrl && finalUrl !== 'Invalid URL' && (
            <button onClick={() => navigator.clipboard.writeText(finalUrl)} className="absolute bottom-4 right-4 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors">
              <Copy size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
