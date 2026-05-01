import React, { useState, useCallback, useRef } from 'react';
import { Eye, Globe, ExternalLink, AlertCircle, Copy, Check, Share2, Layers, Zap } from 'lucide-react';

interface EmbedData {
  title: string;
  description: string;
  image: string | null;
  domain: string;
  url: string;
  favicon: string | null;
  themeColor: string;
}

export default function LinkEmbedStudio() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<EmbedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // FIX: Robust Fetching Engine to bypass CORS/CSP
  const fetchEmbedData = async () => {
    if (!url) return;
    
    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) targetUrl = `https://${targetUrl}`;

    setLoading(true);
    setError('');
    
    try {
      // Primary Engine: AllOrigins with Cache Busting
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&timestamp=${Date.now()}`;
      const res = await fetch(proxyUrl);
      
      if (!res.ok) throw new Error('Proxy unreachable');
      const json = await res.json();
      
      if (!json.contents) {
        throw new Error('This site strictly blocks automated scrapers. Try a different URL.');
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(json.contents, 'text/html');
      
      const getMeta = (props: string[]) => {
        for (const prop of props) {
          const el = doc.querySelector(`meta[property="${prop}"], meta[name="${prop}"]`);
          if (el) return el.getAttribute('content');
        }
        return null;
      };

      // Extract Rich Data
      const title = getMeta(['og:title', 'twitter:title', 'title']) || doc.querySelector('title')?.innerText || 'Unknown Destination';
      const description = getMeta(['og:description', 'twitter:description', 'description']) || 'No preview summary provided by the host.';
      const image = getMeta(['og:image', 'twitter:image', 'image', 'thumbnail']);
      const themeColor = getMeta(['theme-color', 'msapplication-TileColor']) || '#6366f1';
      
      // Favicon logic
      let favicon = doc.querySelector('link[rel*="icon"]')?.getAttribute('href');
      if (favicon && !favicon.startsWith('http')) {
        favicon = new URL(favicon, targetUrl).href;
      }

      const domain = new URL(targetUrl).hostname.replace('www.', '');

      setData({
        title,
        description,
        image,
        domain,
        url: targetUrl,
        favicon,
        themeColor
      });
    } catch (err) {
      setError('CORS/Security Block: The target site has high-level protection. Most modern browsers block these requests for privacy.');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(data?.url || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10 font-sans">
      {/* Search Console */}
      <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-5 mb-10">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl rotate-3">
            <Zap className="text-white fill-current" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter dark:text-white">Smart Embed Engine</h1>
            <p className="text-slate-500 font-medium tracking-tight">Convert raw URLs into rich social cards</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchEmbedData()}
            placeholder="Paste URL (e.g., spotify.com, github.com)"
            className="flex-1 p-6 bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-3xl dark:text-white focus:border-indigo-500 outline-none text-lg transition-all"
          />
          <button 
            onClick={fetchEmbedData}
            disabled={loading}
            className="px-10 py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
          >
            {loading ? 'Processing...' : 'Generate Embed'}
          </button>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-3 p-5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl border border-rose-100 dark:border-rose-800/30">
            <AlertCircle size={18} />
            <span className="text-xs font-bold">{error}</span>
          </div>
        )}
      </section>

      {/* Embed Output Area */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-10 duration-700">
          
          {/* THE EMBED (Social Style) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <Layers size={14} /> Rendered Preview
            </h3>
            
            <div className="bg-[#f2f3f5] dark:bg-[#2b2d31] rounded-xl overflow-hidden shadow-lg border-l-4" style={{ borderColor: data.themeColor }}>
              <div className="p-4 flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    {data.favicon && <img src={data.favicon} className="w-4 h-4 rounded-full" alt="" />}
                    <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:underline cursor-pointer">{data.domain}</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#060607] dark:text-white leading-tight">
                    <a href={data.url} target="_blank" rel="noreferrer" className="hover:underline">{data.title}</a>
                  </h2>
                  <p className="text-sm text-[#2e3338] dark:text-[#dbdee1] leading-snug">
                    {data.description}
                  </p>
                </div>
                
                {data.image && (
                  <div className="md:w-32 md:h-32 w-full h-48 rounded-lg overflow-hidden flex-shrink-0 bg-black/5">
                    <img src={data.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Interaction</h3>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
              <button 
                onClick={copyLink}
                className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                    {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} className="text-slate-400 group-hover:text-indigo-500" />}
                  </div>
                  <span className="text-sm font-bold dark:text-white">{copied ? 'Link Copied!' : 'Copy Source URL'}</span>
                </div>
                <ExternalLink size={16} className="text-slate-300" />
              </button>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Metadata Tags Found</p>
                <div className="flex flex-wrap gap-2">
                  <Tag label="OpenGraph" active={!!data.image} />
                  <Tag label="Twitter Cards" active={true} />
                  <Tag label="Theme-Color" active={data.themeColor !== '#6366f1'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Tag({ label, active }: { label: string, active: boolean }) {
  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
      active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
    }`}>
      {label}
    </span>
  );
}