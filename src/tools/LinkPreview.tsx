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

  // --- Logic: Normalize Input (Handles 'htp', 'google.com', etc.) ---
  const normalizeUrl = (input: string): string => {
    let cleaned = input.trim();
    // Regex: Check if it starts with any variation of http/https
    if (!/^https?:\/\//i.test(cleaned)) {
      // Remove common typos at the start like htp:// or hp://
      cleaned = cleaned.replace(/^(hp|htp|htpp|http):?(\/\/)?/i, '');
      cleaned = `https://${cleaned}`;
    }
    return cleaned;
  };

  // --- Logic: Waterfall Fetching to Bypass CORS/Security ---
  const fetchWithFallback = async (targetUrl: string) => {
    const proxies = [
      (u: string) => `[https://api.allorigins.win/get?url=$](https://api.allorigins.win/get?url=$){encodeURIComponent(u)}&_=${Date.now()}`,
      (u: string) => `[https://corsproxy.io/?$](https://corsproxy.io/?$){encodeURIComponent(u)}`
    ];

    for (const getProxyUrl of proxies) {
      try {
        const res = await fetch(getProxyUrl(targetUrl));
        if (!res.ok) continue;

        const result = await res.text();
        let html = '';
        
        try {
          // Attempt to parse as JSON (AllOrigins format)
          const json = JSON.parse(result);
          html = json.contents || '';
        } catch {
          // Use raw text (Corsproxy format)
          html = result;
        }

        if (html && html.length > 200) return html;
      } catch (e) {
        console.warn("Proxy attempt failed, moving to next...");
      }
    }
    throw new Error("Target site blocked the request (CORS/Security Headers).");
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

      // Extract Content
      const title = getMeta(['og:title', 'twitter:title', 'title']) || doc.querySelector('title')?.innerText || 'Link Preview';
      const description = getMeta(['og:description', 'twitter:description', 'description']) || 'No description available.';
      const image = getMeta(['og:image', 'twitter:image', 'image']);
      const themeColor = getMeta(['theme-color']) || '#6366f1';
      
      // Strict Favicon Handling (TS Fix)
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
      setError('This site has strict security (like ChatGPT/Cloudflare). Client-side access is limited.');
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
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="text-white fill-current" size="{20}"/>
          </div>
          <h2 className="text-xl font-black dark:text-white">Universal Embed Generator</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generatePreview()}
            placeholder="google.com, htp://site.com, etc."
            className="flex-1 p-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:border-indigo-500 transition-all"
          />
          <button 
            onClick={generatePreview}
            disabled={loading}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-indigo-500/20"
          >
            {loading ? 'Fetching...' : 'Preview'}
          </button>
        </div>
        {error && <div className="mt-4 text-rose-500 text-xs font-bold flex items-center gap-2"><AlertCircle size="{14}"/> {error}</div>}
      </div>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="md:col-span-8">
            <div className="bg-[#f2f3f5] dark:bg-[#2b2d31] rounded-lg overflow-hidden border-l-4 shadow-lg" style={{ borderColor: data.themeColor }}>
              <div className="p-4 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {data.favicon && <img src={data.favicon} className="w-3 h-3 rounded-full" alt="" />}
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tight">{data.domain}</span>
                  </div>
                  <h3 className="text-base font-bold dark:text-white leading-tight hover:underline cursor-pointer">
                    <a href={data.url} target="_blank" rel="noreferrer">{data.title}</a>
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-[#dbdee1] line-clamp-3">
                    {data.description}
                  </p>
                </div>
                {data.image && (
                  <div className="w-full sm:w-24 h-32 sm:h-24 rounded-md overflow-hidden bg-black/5 flex-shrink-0">
                    <img src={data.image} className="w-full h-full object-cover" alt="" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl self-start space-y-4">
            <button 
              onClick={copyLink}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
            >
              {copied ? <Check size="{14}"/> : <Copy size="{14}"/>}
              {copied ? 'Copied' : 'Copy Source'}
            </button>
            <a 
              href={data.url} 
              target="_blank" 
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700"
            >
              Visit <ExternalLink size="{14}"/>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}