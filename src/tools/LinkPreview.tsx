import React, { useState } from 'react';
import { Eye, Globe, ExternalLink, AlertCircle, Copy, Check, Zap, ShieldCheck } from 'lucide-react';

interface EmbedData {
  title: string;
  description: string;
  image: string | null;
  domain: string;
  url: string;
  favicon: string | null;
  themeColor: string;
}

export default function UniversalEmbedTool() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<EmbedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const normalizeUrl = (input: string): string => {
    let cleaned = input.trim();
    if (!/^https?:\/\//i.test(cleaned)) {
      // Fixes 'htp', 'hp', or missing protocol
      cleaned = cleaned.replace(/^(hp|htp|htpp|http):?(\/\/)?/i, '');
      cleaned = `https://${cleaned}`;
    }
    return cleaned;
  };

  const fetchMetadata = async (targetUrl: string) => {
    // Strategy: Use a high-availability proxy first
    const proxyUrls = [
      `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
      `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`
    ];

    for (const proxy of proxyUrls) {
      try {
        const response = await fetch(proxy);
        if (!response.ok) continue;

        const text = await response.text();
        let html = '';

        try {
          // If the proxy returns JSON (like AllOrigins), parse it
          const json = JSON.parse(text);
          html = json.contents || '';
        } catch {
          // Otherwise, treat as raw HTML
          html = text;
        }

        if (html && html.length > 200) return html;
      } catch (err) {
        continue;
      }
    }
    throw new Error("Security Lockdown: This site blocks automated previews.");
  };

  const handleGenerate = async () => {
    if (!url) return;
    const targetUrl = normalizeUrl(url);

    setLoading(true);
    setError('');
    
    try {
      const html = await fetchMetadata(targetUrl);
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
      const description = getMeta(['og:description', 'twitter:description', 'description']) || 'No summary available.';
      const image = getMeta(['og:image', 'twitter:image', 'image']);
      const themeColor = getMeta(['theme-color']) || '#4f46e5';
      
      const faviconAttr = doc.querySelector('link[rel*="icon"]')?.getAttribute('href');
      let finalFavicon: string | null = null;
      if (faviconAttr) {
        try {
          finalFavicon = faviconAttr.startsWith('http') ? faviconAttr : new URL(faviconAttr, targetUrl).href;
        } catch {
          finalFavicon = null;
        }
      }

      setData({
        title,
        description,
        image: image || null,
        domain: new URL(targetUrl).hostname.replace('www.', ''),
        url: targetUrl,
        favicon: finalFavicon,
        themeColor
      });
    } catch (e) {
      setError("Site Protected. Major platforms (ChatGPT/Amazon) require a backend scaper to bypass bot detection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 antialiased">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-black dark:text-white tracking-tight">Stealth Link Preview</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="Paste any link (even htp:// typos)"
            className="flex-1 p-5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl dark:text-white outline-none focus:border-indigo-500 transition-all text-lg"
          />
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-3xl font-black uppercase tracking-widest text-sm transition-all"
          >
            {loading ? 'Bypassing...' : 'Preview'}
          </button>
        </div>
        {error && <p className="mt-4 text-rose-500 text-xs font-bold uppercase tracking-tighter italic">{error}</p>}
      </div>

      {data && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div 
            className="bg-[#f2f3f5] dark:bg-[#2b2d31] rounded-xl overflow-hidden border-l-[6px] shadow-xl p-6 flex flex-col md:flex-row gap-6" 
            style={{ borderColor: data.themeColor }}
          >
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                {data.favicon && <img src={data.favicon} className="w-4 h-4 rounded-full" alt="" />}
                <span className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">{data.domain}</span>
              </div>
              <h3 className="text-xl font-bold dark:text-white leading-tight underline-offset-4 hover:underline cursor-pointer">
                <a href={data.url} target="_blank" rel="noreferrer">{data.title}</a>
              </h3>
              <p className="text-sm text-slate-600 dark:text-[#dbdee1] leading-relaxed line-clamp-3">
                {data.description}
              </p>
            </div>
            {data.image && (
              <div className="w-full md:w-40 h-40 rounded-xl overflow-hidden bg-black/5 flex-shrink-0 shadow-inner">
                <img src={data.image} className="w-full h-full object-cover" alt="" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}