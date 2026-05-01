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

  // --- Logic 1: Smart Normalization ---
  // Fixes "htp", "google.com", or missing protocols
  const normalizeUrl = (input: string): string => {
    let cleaned = input.trim();
    if (!/^https?:\/\//i.test(cleaned)) {
      // Strips common typos like 'htp://' or 'hp://' and replaces with 'https://'
      cleaned = cleaned.replace(/^(hp|htp|htpp|http):?(\/\/)?/i, '');
      cleaned = `https://${cleaned}`;
    }
    return cleaned;
  };

  // --- Logic 2: Waterfall Fetching ---
  // Tries multiple proxies to bypass CORS/Security blocks
  const fetchWithFallback = async (targetUrl: string) => {
    const proxies = [
      (u: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}&_=${Date.now()}`,
      (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`
    ];

    for (const getProxyUrl of proxies) {
      try {
        const res = await fetch(getProxyUrl(targetUrl));
        if (!res.ok) continue;

        const result = await res.text();
        let html = '';
        
        try {
          // Check if response is JSON (AllOrigins) or raw HTML (CorsProxy)
          const json = JSON.parse(result);
          html = json.contents || '';
        } catch {
          html = result;
        }

        if (html && html.length > 200) return html;
      } catch (e) {
        console.warn("Attempt failed, trying next proxy...");
      }
    }
    throw new Error("Access Blocked: Target site has high-level security headers.");
  };

  const generatePreview = async () => {
    if (!url) return;
    const targetUrl = normalizeUrl(url);

    setLoading(true);
    setError('');
    
    try {
      const html = await fetchWithFallback(targetUrl);
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const getMeta = (props: string[]) => {
        for (const prop of props) {
          const el = doc.querySelector(`meta[property="${prop}"], meta[name="${prop}"]`);
          const content = el?.getAttribute('content');
          if (content) return content;
        }
        return null;
      };

      // Content Extraction
      const title = getMeta(['og:title', 'twitter:title', 'title']) || doc.querySelector('title')?.innerText || 'Link Preview';
      const description = getMeta(['og:description', 'twitter:description', 'description']) || 'No description available for this site.';
      const image = getMeta(['og:image', 'twitter:image', 'image']);
      const themeColor = getMeta(['theme-color']) || '#6366f1';
      
      // Strict Favicon Handling (Fixes TS2322)
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
      setError('This site is protected (e.g. ChatGPT/Amazon). Browser-based tools are often blocked.');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Control Panel */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3">
            <Zap className="text-white fill-current" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black dark:text-white leading-tight">Universal Preview</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Metadata Embed Generator</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generatePreview()}
            placeholder="google.com, htp://site.com..."
            className="flex-1 p-5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl dark:text-white outline-none focus:border-indigo-500 transition-all text-lg"
          />
          <button 
            onClick={generatePreview}
            disabled={loading}
            className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-3xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
          >
            {loading ? 'Fetching...' : 'Generate'}
          </button>
        </div>
        {error && (
          <div className="mt-4 flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-wider">
            <AlertCircle size={14}/> {error}
          </div>
        )}
      </div>

      {/* Output Area */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in slide-in-from-bottom-5 duration-500">
          <div className="md:col-span-8">
            <div 
              className="bg-[#f2f3f5] dark:bg-[#2b2d31] rounded-2xl overflow-hidden border-l-[6px] shadow-2xl transition-transform hover:scale-[1.01]" 
              style={{ borderColor: data.themeColor }}
            >
              <div className="p-6 flex flex-col sm:flex-row gap-6">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {data.favicon && <img src={data.favicon} className="w-4 h-4 rounded-full" alt="icon" />}
                    <span className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">{data.domain}</span>
                  </div>
                  <h3 className="text-xl font-bold dark:text-white leading-tight">
                    <a href={data.url} target="_blank" rel="noreferrer" className="hover:underline">{data.title}</a>
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-[#dbdee1] leading-relaxed line-clamp-3">
                    {data.description}
                  </p>
                </div>
                {data.image && (
                  <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-black/5 flex-shrink-0 shadow-inner">
                    <img src={data.image} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-4 space-y-4">
            <button 
              onClick={copyLink}
              className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-[2rem] border border-slate-100 dark:border-slate-800 transition-all font-black text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 shadow-sm"
            >
              <span>{copied ? 'Copied to Clipboard' : 'Copy Link URL'}</span>
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
            <a 
              href={data.url} 
              target="_blank" 
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-3 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
            >
              Visit Website <ExternalLink size={16} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}