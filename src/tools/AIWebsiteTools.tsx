import { useState } from "react";
import { Icon } from "../components/Icon";

type Tool = {
  name: string;
  url: string;
  type: "Free" | "Freemium" | "Paid";
  tags: string[];
};

const tools: Tool[] = [
  { name: "Framer AI", url: "https://www.framer.com/ai", type: "Freemium", tags: ["design", "professional"] },
  { name: "Durable AI", url: "https://durable.co", type: "Freemium", tags: ["1-click site"] },
  { name: "ATXP.ai", url: "https://atxp.ai", type: "Freemium", tags: ["agent-protocol", "multi-model"] },
  { name: "10Web AI", url: "https://10web.io", type: "Freemium", tags: ["wordpress", "automation"] },
  { name: "Wix AI", url: "https://www.wix.com/ai", type: "Freemium", tags: ["builder", "easy"] },
  { name: "Hostinger AI", url: "https://www.hostinger.com/ai-website-builder", type: "Paid", tags: ["hosting", "fast"] },
  { name: "Webflow", url: "https://webflow.com", type: "Freemium", tags: ["no-code", "expert"] },
  { name: "TeleportHQ", url: "https://teleporthq.io", type: "Freemium", tags: ["frontend", "code export"] },
];

export default function AIWebsiteTools() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = tools.filter(tool => {
    const matchFilter = filter === "All" || tool.type === filter;
    const matchSearch = tool.name.toLowerCase().includes(search.toLowerCase()) || tool.tags.join(" ").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans bg-[#fbfcfd] min-h-screen">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
          AI Web Builders
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Launch professional websites in minutes with AI-powered design and development.
        </p>
      </div>

      <div className="relative mb-10 group max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <input
          type="text"
          placeholder="Search by builder name or feature..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="relative w-full p-5 pl-14 border-0 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700 bg-white"
        />
        <span className="absolute left-5 top-5 text-gray-400">🔍</span>
      </div>

      <div className="flex gap-3 mb-10 flex-wrap justify-center">
        {["All", "Free", "Freemium", "Paid"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-8 py-2.5 rounded-xl font-bold transition-all duration-300 ${filter === f ? "bg-gray-900 text-white shadow-xl scale-105" : "bg-white text-gray-500 border border-gray-100 shadow-sm"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((tool, i) => (
          <a key={i} href={tool.url} target="_blank" className="group relative p-8 bg-white border border-gray-50 rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:bg-blue-100 transition-colors"></div>
            <div className="relative flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl text-gray-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <Icon name="website" className="w-6 h-6" />
                </div>
                <h2 className="font-bold text-2xl text-gray-800 group-hover:text-blue-600 transition-colors">{tool.name}</h2>
              </div>
              <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-black ${tool.type === 'Free' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                {tool.type}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {tool.tags.map(tag => (
                <span key={tag} className="text-[11px] bg-gray-50 text-gray-400 px-3 py-1.5 rounded-lg border border-gray-100 font-medium group-hover:text-blue-400 transition-all">#{tag}</span>
              ))}
            </div>
            <div className="pt-5 border-t border-gray-50 flex items-center justify-between text-sm font-bold text-gray-400 group-hover:text-blue-600 transition-all">
              <span>Launch Site</span>
              <span className="transform translate-x-0 group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}