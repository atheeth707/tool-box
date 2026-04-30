import { useState } from "react";
import { Icon } from "../components/Icon";

type Tool = {
  name: string;
  url: string;
  type: "Free" | "Freemium" | "Paid";
  category: "SEO & Keywords" | "Script & Ideas" | "Video & Voice" | "Analytics";
  tags: string[];
};

const tools: Tool[] = [
  // 📈 SEO & KEYWORDS
  { name: "vidIQ", url: "https://vidiq.com", type: "Freemium", category: "SEO & Keywords", tags: ["youtube", "keywords", "competitors"] },
  { name: "Tube Buddy", url: "https://www.tubebuddy.com", type: "Freemium", category: "SEO & Keywords", tags: ["extension", "management", "seo"] },
  { name: "Answer The Public", url: "https://answerthepublic.com", type: "Freemium", category: "SEO & Keywords", tags: ["search trends", "ideas"] },
  { name: "Ahrefs Keyword Explorer", url: "https://ahrefs.com/keyword-generator", type: "Free", category: "SEO & Keywords", tags: ["google", "youtube seo"] },

  // ✍️ SCRIPT & IDEAS
  { 
    name: "AI YT Title Gen", 
    url: "https://tool-box-free.vercel.app/tool/yt-title-generator", 
    type: "Free", 
    category: "Script & Ideas", 
    tags: ["viral titles", "no-signup", "youtube-seo"] 
  },
  { name: "ChatGPT", url: "https://chat.openai.com", type: "Freemium", category: "Script & Ideas", tags: ["scripts", "brainstorming", "gpt-4"] },
  { name: "Claude AI", url: "https://claude.ai", type: "Freemium", category: "Script & Ideas", tags: ["long-form", "creative writing"] },
  { name: "ATXP.ai", url: "https://atxp.ai", type: "Freemium", category: "Script & Ideas", tags: ["agent-protocol", "free-credits", "automation"] },
  { name: "Jasper AI", url: "https://www.jasper.ai", type: "Paid", category: "Script & Ideas", tags: ["marketing", "copywriting"] },
  { name: "Copy.ai", url: "https://www.copy.ai", type: "Freemium", category: "Script & Ideas", tags: ["social media", "blogging"] },

  // 🎙️ VIDEO & VOICE
  { name: "ElevenLabs", url: "https://elevenlabs.io", type: "Freemium", category: "Video & Voice", tags: ["voiceover", "realistic ai"] },
  { name: "HeyGen", url: "https://www.heygen.com", type: "Freemium", category: "Video & Voice", tags: ["avatar", "talking head"] },
  { name: "Pictory", url: "https://pictory.ai", type: "Paid", category: "Video & Voice", tags: ["script to video", "stock footage"] },
  { name: "Descript", url: "https://www.descript.com", type: "Freemium", category: "Video & Voice", tags: ["editing", "transcription", "podcasting"] },
  { name: "Lovo.ai", url: "https://lovo.ai", type: "Freemium", category: "Video & Voice", tags: ["voice cloning", "ads"] },

  // 📊 ANALYTICS & THUMBNAILS
  { name: "Thumbnail Check", url: "https://thumbnailcheck.com", type: "Free", category: "Analytics", tags: ["ab testing", "preview"] },
  { name: "Social Blade", url: "https://socialblade.com", type: "Free", category: "Analytics", tags: ["stats", "growth tracking"] },
  { name: "ViewStats", url: "https://www.viewstats.com", type: "Free", category: "Analytics", tags: ["mrbeast tool", "advanced stats"] },
];

export default function AIContentTools() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = tools.filter(tool => {
    const matchFilter = filter === "All" || tool.type === filter;
    const matchSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.tags.join(" ").toLowerCase().includes(search.toLowerCase()) ||
      tool.category.toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans bg-[#fbfcfd] dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* HERO SECTION */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent">
          AI Content Creation Hub
        </h1>
        <p className="text-gray-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          Scale your YouTube and social media presence using the world's most powerful AI tools.
        </p>
      </div>

      {/* SEARCH BOX */}
      <div className="relative mb-10 group max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <input
          type="text"
          placeholder="Search by tool, platform, or tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="relative w-full p-5 pl-14 border-0 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700 bg-white dark:bg-slate-900 dark:text-slate-200 dark:placeholder-slate-500"
        />
        <span className="absolute left-5 top-5 text-gray-400 dark:text-slate-500">🔍</span>
      </div>

      {/* PRICE FILTERS */}
      <div className="flex gap-3 mb-10 flex-wrap justify-center">
        {["All", "Free", "Freemium", "Paid"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-8 py-2.5 rounded-xl font-bold transition-all duration-300 ${
              filter === f 
              ? "bg-gray-900 text-white dark:bg-blue-600 shadow-xl scale-105" 
              : "bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 shadow-sm"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* TOOLS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((tool, i) => (
          <a
            key={i}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-8 bg-white dark:bg-slate-900 border border-gray-50 dark:border-slate-800 rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full -mr-16 -mt-16 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition-colors"></div>

            <div className="relative flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-700 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <Icon name={tool.category} className="w-6 h-6" />
                </div>
                <h2 className="font-bold text-2xl text-gray-800 dark:text-slate-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.name}
                </h2>
              </div>
              <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-black ${
                tool.type === 'Free' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                tool.type === 'Freemium' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
              }`}>
                {tool.type}
              </span>
            </div>

            <p className="text-xs font-black text-blue-500/50 uppercase tracking-[0.2em] mb-4">
              {tool.category}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {tool.tags.map(tag => (
                <span key={tag} className="text-[11px] bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700 font-medium group-hover:border-blue-100 dark:group-hover:border-blue-900 group-hover:text-blue-400 transition-all">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="pt-5 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between text-sm font-bold text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
              <span>Explore Platform</span>
              <span className="transform translate-x-0 group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}