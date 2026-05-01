import React, { useState, useCallback } from 'react';
import { Eye, Globe, ExternalLink, AlertCircle, Share2, Copy, Check } from 'lucide-react';

interface PreviewData {
  title: string;
  description: string;
  image: string | null;
  domain: string;
  url: string;
  favicon: string | null;
}

export default function AdvancedLinkPreview() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchPreview = async () => {
    if (!url) return;
    
    // Normalize URL
    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    setLoading(true);
    setError('');
    
    try {
      // Using a more robust proxy approach
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
      const res = await fetch(proxyUrl);
      
      if (!res.ok) throw new Error('Network response was not ok');
      
      const json = await res.json();
      if (!json.contents) throw new Error('No content found');

      const parser = new DOMParser();
      const doc = parser.parseFromString(json.contents, 'text/html');
      
      const getMeta = (props: string[]) => {
        for (const prop of props) {
          const el = doc.querySelector(`meta[property="${prop}"], meta[name="${prop}"]`);
          if (el) return el.getAttribute('content');
        }
        return null;
      };

      // Advanced Scraping Logic
      const title = getMeta(['og:title', 'twitter:title', 'title']) || doc.querySelector('title')?.innerText || 'Untitled Page';
      const description = getMeta(['og:description', 'twitter:description', 'description']) || 'No summary available for this destination.';
      const image = getMeta(['og:image', 'twitter:image', 'image']);
      
      // Favicon logic
      const favicon = doc.querySelector('link[rel*="icon"]')?.getAttribute('href');
      let finalFavicon = null;
      if (favicon) {
        finalFavicon = favicon.startsWith('http') ? favicon : new URL(favicon, targetUrl).href;
      }

      const domain = new URL(targetUrl).hostname.replace('www.', '');

      setData({
        title,
        description,
        image,
        domain,
        url: targetUrl,
        favicon: finalFavicon
      });
    } catch (err) {
      setError('Could not fetch preview. This site may have strict security headers (CORS/CSP).');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8 animate-in fade-in duration-500">
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Eye className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight dark:text-white">Meta Explorer</h2>
            <p className="text-slate-500 text-sm font-medium">Extract social metadata from any URL</p>
          </div>
        </div>

        <div className="relative group">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchPreview()}
            placeholder="Paste link here (e.g., github.com)"
            className="w-full p-6 pr-40 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-lg transition-all"
          />
          <button 
            onClick={fetchPreview}
            disabled={loading || !url}
            className="absolute right-3 top-3 bottom-3 px-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            {loading ? <RefreshIcon /> : 'Analyze'}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-6 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-3xl border border-rose-100 dark:border-rose-800/30 animate-in slide-in-from-top-2">
          <AlertCircle size={20} />
          <p className="font-bold text-sm">{error}</p>
        </div>
      )}

      {loading && <SkeletonCard />}

      {data && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Card Preview */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Visual Card</h3>
            <div className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 transition-transform hover:-translate-y-1">
              <a href={data.url} target="_blank" rel="noreferrer" className="block">
                <div className="aspect-video bg-slate-100 dark:bg-slate-950 relative overflow-hidden">
                  {data.image ? (
                    <img src={data.image} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-3">
                      <Globe size={64} strokeWidth={1} />
                      <span className="text-[10px] font-black uppercase">No Media Found</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold">
                    {data.favicon && <img src={data.favicon} className="w-4 h-4 rounded-sm" alt="icon" />}
                    {data.domain}
                  </div>
                </div>
                <div className="p-8">
                  <h4 className="text-xl font-black dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                    {data.title}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6">
                    {data.description}
                  </p>
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-tighter">
                    Read More <ExternalLink size={14} />
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Data Inspector */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Metadata Inspector</h3>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-6">
              <DataField label="Full Destination" value={data.url} />
              <DataField label="Meta Title" value={data.title} />
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all font-black text-xs uppercase tracking-widest"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied' : 'Copy URL'}
                </button>
                <button className="flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all font-black text-xs uppercase tracking-widest">
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components
function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl text-sm font-mono text-slate-600 dark:text-slate-300 break-all border border-slate-100 dark:border-slate-800">
        {value}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl animate-pulse border border-slate-100 dark:border-slate-800">
      <div className="aspect-video bg-slate-200 dark:bg-slate-800" />
      <div className="p-8 space-y-4">
        <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-lg" />
        <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-800 rounded-lg" />
      </div>
    </div>
  );
}

function RefreshIcon() {
  return (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}