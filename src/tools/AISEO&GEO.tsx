import { useState } from "react";

type Tool = {
  name: string;
  url: string;
  type: "Free" | "Freemium" | "Paid" | "Enterprise";
  category: "Traditional SEO" | "GEO (AI Search)" | "AEO (Voice/Snippets)";
  specialty: string;
  tags: string[];
};

const tools: Tool[] = [
  // 🌐 GEO (GENERATIVE ENGINE OPTIMIZATION)
  { 
    name: "Spotlight AI", 
    url: "https://get-spotlight.com", 
    type: "Paid", 
    category: "GEO (AI Search)", 
    specialty: "AI Visibility Tracking",
    tags: ["citation rate", "chatgpt ranking", "sentiment"] 
  },
  { 
    name: "Profound", 
    url: "https://profound.com", 
    type: "Enterprise", 
    category: "GEO (AI Search)", 
    specialty: "LLM Share of Voice",
    tags: ["brand mentions", "perplexity", "gemini"] 
  },
  { 
    name: "Evertune", 
    url: "https://evertune.ai", 
    type: "Paid", 
    category: "GEO (AI Search)", 
    specialty: "AI Brand Score",
    tags: ["citations", "attribution", "conversion"] 
  },
  { 
    name: "Otterly.AI", 
    url: "https://otterly.ai", 
    type: "Freemium", 
    category: "GEO (AI Search)", 
    specialty: "Brand Watchdog",
    tags: ["real-time monitoring", "mentions", "smb"] 
  },

  // 🔍 TRADITIONAL SEO (AI ENHANCED)
  { 
    name: "Surfer SEO", 
    url: "https://surferseo.com", 
    type: "Paid", 
    category: "Traditional SEO", 
    specialty: "Content Scoring",
    tags: ["serp analysis", "nlp", "optimization"] 
  },
  { 
    name: "Semrush AIO", 
    url: "https://semrush.com", 
    type: "Paid", 
    category: "Traditional SEO", 
    specialty: "Competitive Intel",
    tags: ["keywords", "backlinks", "ai-toolkit"] 
  },
  { 
    name: "Rank Math AI", 
    url: "https://rankmath.com", 
    type: "Freemium", 
    category: "Traditional SEO", 
    specialty: "WP Optimization",
    tags: ["wordpress", "schema", "meta-tags"] 
  },

  // 🗣️ AEO & ANSWERS
  { 
    name: "Relixir", 
    url: "https://relixir.ai", 
    type: "Paid", 
    category: "AEO (Voice/Snippets)", 
    specialty: "Q&A Simulation",
    tags: ["voice search", "featured snippets", "faq"] 
  },
  { 
    name: "Frase", 
    url: "https://frase.io", 
    type: "Freemium", 
    category: "AEO (Voice/Snippets)", 
    specialty: "Search Intent Mapping",
    tags: ["briefs", "ai-writing", "snippets"] 
  }
];

export default function AISEOGeoHub() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = tools.filter(tool => {
    const matchFilter = filter === "All" || tool.category.includes(filter);
    const matchSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.specialty.toLowerCase().includes(search.toLowerCase()) ||
      tool.tags.join(" ").toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-black tracking-tight mb-4">
            AI <span className="text-indigo-600">SEO & GEO</span> Hub
          </h1>
          <p className="text-slate-500 text-lg">
            Tools to rank on Google AND get cited by ChatGPT.
          </p>
        </header>

        {/* SEARCH & FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Search by specialty or tool name..."
            className="flex-1 p-4 rounded-2xl border-none shadow-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex bg-white p-1 rounded-2xl shadow-md">
            {["All", "SEO", "GEO", "AEO"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  filter === cat ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* LISTING */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((tool, idx) => (
            <div key={idx} className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
                  {tool.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">{tool.type}</span>
              </div>
              
              <h3 className="text-2xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">{tool.name}</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                <span className="font-bold text-slate-900 italic">Core:</span> {tool.specialty}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {tool.tags.map(tag => (
                  <span key={tag} className="text-[11px] bg-slate-100 text-slate-500 px-3 py-1 rounded-lg">
                    #{tag}
                  </span>
                ))}
              </div>

              <a 
                href={tool.url} 
                target="_blank" 
                className="block w-full text-center py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200"
              >
                Access Tool
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}