import React, { useState } from 'react';
import { Eye, Globe, ExternalLink, AlertCircle, Copy, Check, Zap, Layers } from 'lucide-react';

interface EmbedData {
  title: string;
  description: string;
  image: string | null;
  domain: string;
  url: string;
  favicon: string | null;
  themeColor: string;
}

export default function LinkPreview() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<EmbedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchPreview = async () => {
    if (!url) return;
    
    // Normalize URL input
    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    setLoading(true);
    setError('');
    
    try {
      // Bypass CORS using allorigins with a timestamp to avoid cached errors
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&_=${Date.now()}`;
      const res = await fetch(proxyUrl);
      
      if (!res.ok) throw new Error('Network response was not ok');
      
      const json = await res.json();
      if (!json.contents) throw new Error('Could not retrieve site content');

      const parser = new DOMParser();
      const doc = parser.parseFromString(json.contents, 'text/html');
      
      // Helper to safely extract meta content
      const getMeta = (props: string[]): string | null => {
        for (const prop of props) {
          const el = doc.querySelector(`meta[property="${prop}"], meta[name="${prop}"]`);
          const content = el?.getAttribute('content');
          if (content) return content;
        }
        return null;
      };

      // Extract Data with Fallbacks
      const title = getMeta(['og:title', 'twitter:title', 'title']) || doc.querySelector('title')?.innerText || 'Untitled Page';
      const description = getMeta(['og:description', 'twitter:description', 'description']) || 'No description available for this page.';
      const image = getMeta(['og:image', 'twitter:image', 'image']);
      const themeColor = getMeta(['theme-color', 'msapplication-TileColor']) || '#6366f1';
      
      // Strict Favicon Parsing (Fixes TS2322)
      const faviconAttr = doc.querySelector('link[rel*="icon"]')?.getAttribute('href');
      let finalFavicon: string | null = null;
      if (faviconAttr) {
        try {
          finalFavicon = faviconAttr.startsWith('http') 
            ? faviconAttr 
            : new URL(faviconAttr, targetUrl).href;
        } catch {
          finalFavicon = null;
        }
      }

      const domain = new URL(targetUrl).hostname.replace('www.', '');

      setData({
        title,
        description,
        image: image || null, // Ensure undefined becomes null
        domain,
        url: targetUrl,
        favicon: finalFavicon,
        themeColor
      });
    } catch (e) {
      setError('Failed to generate preview. The site might block automated requests or have strict CORS/CSP headers.');
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
      {/* Search & Control Header */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 rotate-3">
            <Zap className="text-white fill-current" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight dark:text-white leading-none mb-1">Smart Embed</h2>
            <p className="text-slate-500 text-sm font-medium">Generate rich social link previews</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchPreview()}
            placeholder="Enter URL (e.g., github.com)"
            className="flex-1 p-5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl dark:text-white focus:border-indigo-500 outline-none text-lg transition-all"
          />
          <button 
            onClick={fetchPreview}
            disabled={loading || !url}
            className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-3xl font-black uppercase tracking-widest text-sm transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            {loading ? 'Analyzing...' : 'Generate'}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-6 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-3xl border border-rose-100 dark:border-rose-800/30 animate-in slide-in-from-top-2">
          <AlertCircle size={20} />
          <p className="font-bold text-sm">{error}</p>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* THE EMBED VIEW */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
              <Layers size={14} /> Visual Embed
            </h3>
            
            {/* Discord/Slack Style Embed Card */}
            <div 
              className="bg-[#f2f3f5] dark:bg-[#2b2d31] rounded-lg overflow-hidden shadow-lg border-l-4 transition-transform hover:scale-[1.01]" 
              style={{ borderColor: data.themeColor }}
            >
              <div className="p-4 flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    {data.favicon && <img src={data.favicon} className="w-4 h-4 rounded-full" alt="icon" />}
                    <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:underline cursor-pointer">
                      {data.domain}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-[#060607] dark:text-white leading-tight">
                    <a href={data.url} target="_blank" rel="noreferrer" className="hover:underline">
                      {data.title}
                    </a>
                  </h2>
                  <p className="text-sm text-[#2e3338] dark:text-[#dbdee1] leading-snug line-clamp-4">
                    {data.description}
                  </p>
                </div>
                
                {data.image && (
                  <div className="md:w-32 md:h-32 w-full h-48 rounded-lg overflow-hidden flex-shrink-0 bg-black/5">
                    <img src={data.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* METADATA INSPECTOR */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Source Info</h3>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Resolved URL</p>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl text-xs font-mono text-slate-600 dark:text-slate-300 break-all border border-slate-100 dark:border-slate-800">
                  {data.url}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all font-black text-xs uppercase tracking-widest"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied' : 'Copy Link'}
                </button>
                <a 
                  href={data.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl transition-all font-black text-xs uppercase tracking-widest hover:bg-indigo-700"
                >
                  Visit <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}