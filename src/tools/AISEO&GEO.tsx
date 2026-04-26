import { useState } from "react";

type Tool = {
  name: string;
  url: string;
  type: "Free" | "Freemium" | "Paid";
  category: "YouTube & Video" | "SEO & GEO" | "Writing & Copy" | "Repurposing";
  tags: string[];
  region?: string;
};

const tools: Tool[] = [
  // 🎥 YOUTUBE & VIDEO (VidIQ Style)
  { name: "YTZolo", url: "https://ytzolo.com", type: "Freemium", category: "YouTube & Video", tags: ["growth", "scripts", "thumbnails"], region: "Global" },
  { name: "vidIQ AI", url: "https://vidiq.com", type: "Freemium", category: "YouTube & Video", tags: ["keywords", "competitors", "seo"], region: "Global" },
  { name: "TubeBuddy", url: "https://tubebuddy.com", type: "Freemium", category: "YouTube & Video", tags: ["a/b testing", "bulk edits"], region: "Global" },
  { name: "Thumbnail Test", url: "https://thumbnailtest.com", type: "Paid", category: "YouTube & Video", tags: ["ctr", "optimization"], region: "Global" },

  // 🌐 SEO & GEO (Search & AI Citation)
  { name: "Atomic AGI", url: "https://atomic.ag", type: "Paid", category: "SEO & GEO", tags: ["geo", "ai search ranking"], region: "Global" },
  { name: "Sight AI", url: "https://trysight.ai", type: "Paid", category: "SEO & GEO", tags: ["visibility", "brand tracking"], region: "Global" },
  { name: "Surfer SEO", url: "https://surferseo.com", type: "Paid", category: "SEO & GEO", tags: ["writing score", "nlp"], region: "Global" },
  { name: "Perplexity", url: "https://perplexity.ai", type: "Free", category: "SEO & GEO", tags: ["research", "citation check"], region: "Global" },

  // ✂️ REPURPOSING (Shorts/Socials)
  { name: "OpusClip Pro", url: "https://opus.pro", type: "Freemium", category: "Repurposing", tags: ["shorts", "virality score"], region: "Global" },
  { name: "Crayo AI", url: "https://crayo.ai", type: "Freemium", category: "Repurposing", tags: ["short-form", "automation"], region: "Global" },
  { name: "Descript", url: "https://descript.com", type: "Freemium", category: "Repurposing", tags: ["editing", "transcription"], region: "Global" },

  // ✍️ WRITING & COPY
  { name: "Jasper AI", url: "https://jasper.ai", type: "Paid", category: "Writing & Copy", tags: ["marketing", "brand voice"], region: "Global" },
  { name: "Claude AI", url: "https://claude.ai", type: "Freemium", category: "Writing & Copy", tags: ["scripts", "long-form"], region: "Global" },
  { name: "Copy.ai", url: "https://copy.ai", type: "Freemium", category: "Writing & Copy", tags: ["social media", "ads"], region: "Global" },
];

export default function AIContentHub() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = tools.filter(tool => {
    const matchFilter = filter === "All" || tool.type === filter;
    const matchSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.category.toLowerCase().includes(search.toLowerCase()) ||
      tool.tags.join(" ").toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2 text-gray-900">
          🚀 <span className="text-blue-600">AI</span> Content Creator Hub
        </h1>
        <p className="text-gray-500">The 2026 stack for YouTube, SEO, and Brand Visibility.</p>
      </div>

      {/* SEARCH */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search tools, platforms (YouTube, Shorts, SEO)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 pl-12 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        <span className="absolute left-4 top-4 text-gray-400">🔍</span>
      </div>

      {/* FILTER */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {["All", "Free", "Freemium", "Paid"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
              filter === f ? "bg-blue-600 text-white shadow-lg" : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tool, i) => (
          <a
            key={i}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-bold text-xl group-hover:text-blue-600 transition-colors">{tool.name}</h2>
              <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter ${
                tool.type === 'Free' ? 'bg-green-100 text-green-700' : 
                tool.type === 'Freemium' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {tool.type}
              </span>
            </div>

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              {tool.category}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {tool.tags.map(tag => (
                <span key={tag} className="text-[11px] bg-gray-50 text-gray-500 px-2.5 py-1 rounded-lg border border-gray-100">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
              <span className="text-sm font-bold text-blue-600">Open Tool</span>
              {tool.region && <span className="text-[10px] text-gray-400">🌍 {tool.region}</span>}
            </div>
          </a>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400 font-medium">No tools found. Try searching for "YouTube" or "GEO".</div>
      )}
    </div>
  );
}