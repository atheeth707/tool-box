import { useState } from "react";

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
  { name: "TubeBuddy", url: "https://www.tubebuddy.com", type: "Freemium", category: "SEO & Keywords", tags: ["extension", "management", "seo"] },
  { name: "AnswerThePublic", url: "https://answerthepublic.com", type: "Freemium", category: "SEO & Keywords", tags: ["search trends", "ideas"] },
  { name: "Ahrefs Keyword Explorer", url: "https://ahrefs.com/keyword-generator", type: "Free", category: "SEO & Keywords", tags: ["google", "youtube seo"] },

  // ✍️ SCRIPT & IDEAS
  { name: "ChatGPT", url: "https://chat.openai.com", type: "Freemium", category: "Script & Ideas", tags: ["scripts", "brainstorming", "gpt-4"] },
  { name: "Claude AI", url: "https://claude.ai", type: "Freemium", category: "Script & Ideas", tags: ["long-form", "creative writing"] },
  { name: "Jasper AI", url: "https://www.jasper.ai", type: "Paid", category: "Script & Ideas", tags: ["marketing", "copywriting"] },
  { name: "Copy.ai", url: "https://www.copy.ai", type: "Freemium", category: "Script & Ideas", tags: ["social media", "blogging"] },

  // 🎙️ VIDEO & VOICE
  { name: "ElevenLabs", url: "https://elevenlabs.io", type: "Freemium", category: "Video & Voice", tags: ["voiceover", "realistic ai"] },
  { name: "HeyGen", url: "https://www.heygen.com", type: "Freemium", category: "Video & Voice", tags: ["avatar", "talking head"] },
  { name: "Pictory", url: "https://pictory.ai", type: "Paid", category: "Video & Voice", tags: ["script to video", "stock footage"] },
  { name: "Descript", url: "https://www.descript.com", type: "Freemium", category: "Video & Voice", tags: ["editing", "transcription", "podcasting"] },
  { name: "Lovo.ai", url: "https://lovo.ai", type: "Freemium", category: "Video & Voice", tags: ["voice cloning", "ads"] },

  // 📊 ANALYTICS & THUMBNAILS
  { name: "ThumbnailCheck", url: "https://thumbnailcheck.com", type: "Free", category: "Analytics", tags: ["ab testing", "preview"] },
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
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
          🚀 AI Content Creation Hub
        </h1>
        <p className="text-gray-600">The best AI tools to grow your YouTube channel and social media.</p>
      </div>

      {/* SEARCH BOX */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search by tool name, platform (YouTube), or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 pl-12 border-2 border-gray-100 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all"
        />
        <span className="absolute left-4 top-4 opacity-30">🔍</span>
      </div>

      {/* PRICE FILTERS */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {["All", "Free", "Freemium", "Paid"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filter === f 
              ? "bg-gray-900 text-white shadow-lg" 
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* TOOLS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tool, i) => (
          <a
            key={i}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-bold text-xl group-hover:text-blue-600 transition-colors">{tool.name}</h2>
              <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-md font-bold ${
                tool.type === 'Free' ? 'bg-green-100 text-green-700' : 
                tool.type === 'Freemium' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {tool.type}
              </span>
            </div>

            <p className="text-sm font-semibold text-gray-400 uppercase tracking-tighter mb-3">
              {tool.category}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {tool.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs bg-gray-50 text-gray-500 px-3 py-1 rounded-lg border border-gray-100"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-50 flex items-center text-sm font-bold text-blue-500 group-hover:gap-2 transition-all">
              Try Tool <span>→</span>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">No tools found matching your search.</p>
        </div>
      )}
    </div>
  );
}