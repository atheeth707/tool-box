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

export default function UniversalLinkPreview() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<EmbedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchWithFallback = async (targetUrl: string) => {
    // List of free proxies to try in order
    const proxies = [
      (u: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,
      (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
      (u: string) => `https://thingproxy.freeboard.io/fetch/${u}`
    ];

    for (const getProxyUrl of proxies) {
      try {
        const response = await fetch(getProxyUrl(targetUrl));
        if (!response.ok) continue;

        // AllOrigins returns JSON, others return raw HTML
        const result = await response.text();
        let html = '';
        
        try {
          const json = JSON.parse(result);
          html = json.contents || '';
        } catch {
          html = result;
        }

        if (html.length > 200) return html; // Success check
      } catch (e) {
        console.warn("Proxy failed, trying next...");
      }
    }
    throw new Error("All proxy attempts failed.");
  };

  const fetchPreview = async () => {
    if (!url) return;
    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) targetUrl = `https://${targetUrl}`;

    setLoading(true);
    setError('');
    
    try {
      const html = await fetchWithFallback(targetUrl);
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const getMeta = (props: string[]) => {
        for (const prop of props) {
          const el = doc.querySelector(`meta[property="${prop}"], meta[name="${prop}"]`);
          if (el?.getAttribute('content')) return el.getAttribute('content');
        }
        return null;
      };

      const title = getMeta(['og:title', 'twitter:title', 'title']) || doc.querySelector('title')?.innerText || 'Link Preview';
      const description = getMeta(['og:description', 'twitter:description', 'description']) || 'No description provided.';
      const image = getMeta(['og:image', 'twitter:image', 'image']);
      const themeColor = getMeta(['theme-color']) || '#6366f1';
      
      let favicon = doc.querySelector('link[rel*="icon"]')?.getAttribute('href');
      if (favicon && !favicon.startsWith('http')) {
        favicon = new URL(favicon, targetUrl).href;
      }

      setData({
        title,
        description,
        image: image || null,
        domain: new URL(targetUrl).hostname.replace('www.', ''),
        url: targetUrl,
        favicon: favicon || null,
        themeColor
      });
    } catch (e) {
      setError('This site is heavily protected. Client-side previewing is blocked.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste link (ChatGPT, Amazon, etc.)"
            className="flex-1 p-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:border-indigo-500"
          />
          <button 
            onClick={fetchPreview}
            disabled={loading}
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:bg-slate-400"
          >
            {loading ? 'Fetching...' : 'Preview'}
          </button>
        </div>
        {error && <p className="mt-4 text-red-500 text-sm font-bold">{error}</p>}
      </div>

      {data && (
        <div className="bg-[#2b2d31] rounded-lg overflow-hidden border-l-4 shadow-2xl animate-in fade-in" style={{ borderColor: data.themeColor }}>
          <div className="p-4 flex gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {data.favicon && <img src={data.favicon} className="w-4 h-4 rounded-full" alt="" />}
                <span className="text-xs font-bold text-indigo-400">{data.domain}</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{data.title}</h3>
              <p className="text-slate-300 text-sm line-clamp-3">{data.description}</p>
            </div>
            {data.image && (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-md overflow-hidden flex-shrink-0 bg-slate-800">
                <img src={data.image} className="w-full h-full object-cover" alt="" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}