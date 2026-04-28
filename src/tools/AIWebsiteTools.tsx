import { useState } from "react";
import { Icon } from "../components/Icon";

type Tool = {
  name: string;
  url: string;
  type: "Free" | "Freemium" | "Paid";
  tags: string[];
};

const tools: Tool[] = [
  { name: "ATXP.ai", url: "https://atxp.ai", type: "Freemium", tags: ["agent-protocol", "automation"] },
  { name: "Framer AI", url: "https://www.framer.com/ai", type: "Freemium", tags: ["design", "no-code"] },
  { name: "Durable AI", url: "https://durable.co", type: "Freemium", tags: ["1-click site", "business"] },
  { name: "10Web", url: "https://10web.io", type: "Paid", tags: ["wordpress", "hosting"] },
  { name: "Vercel V0", url: "https://v0.dev", type: "Freemium", tags: ["react", "shadcn", "ui"] },
  { name: "Bolt.new", url: "https://bolt.new", type: "Freemium", tags: ["fullstack", "prompt-to-app"] },
  { name: "Relume", url: "https://www.relume.io", type: "Freemium", tags: ["sitemap", "wireframe"] },
  { name: "Wix Studio", url: "https://www.wix.com/studio", type: "Paid", tags: ["professional", "responsive"] },
  { name: "Webflow AI", url: "https://webflow.com", type: "Freemium", tags: ["high-end", "cms"] },
  { name: "Softr AI", url: "https://www.softr.io", type: "Freemium", tags: ["internal-tools", "airtable"] },
  { name: "Hocoos AI", url: "https://hocoos.com", type: "Free", tags: ["instant-builder"] },
  { name: "TeleportHQ", url: "https://teleporthq.io", type: "Freemium", tags: ["low-code", "exports"] },
  { name: "Make.com", url: "https://www.make.com", type: "Freemium", tags: ["automation", "visual"] },
  { name: "Zapier Central", url: "https://zapier.com", type: "Freemium", tags: ["ai-agents", "workflow"] },
  { name: "Replit Agent", url: "https://replit.com", type: "Paid", tags: ["coding-assistant"] },
  { name: "Bubble AI", url: "https://bubble.io", type: "Paid", tags: ["complex-apps"] },
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
    <div className="p-6 max-w-7xl mx-auto font-sans bg-[#fbfcfd] dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">AI Web & Automation</h1>
        <p className="text-gray-500 dark:text-slate-400 text-lg">Build landing pages or deploy agents with ATXP.ai.</p>
      </div>

      <div className="relative mb-10 group max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <input
          type="text"
          placeholder="Search builders and agents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="relative w-full p-5 pl-14 border rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 transition-all"
        />
        <span className="absolute left-5 top-5 text-gray-400">🔍</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((tool, i) => (
          <a key={i} href={tool.url} target="_blank" rel="noopener noreferrer" className="group relative p-8 bg-white dark:bg-slate-900 border border-gray-50 dark:border-slate-800 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full -mr-16 -mt-16 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20"></div>
            <div className="relative flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-700 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Icon name="website" className="w-6 h-6" />
                </div>
                <h2 className="font-bold text-2xl text-gray-800 dark:text-slate-100 group-hover:text-blue-500">{tool.name}</h2>
              </div>
              <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-black bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                {tool.type}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {tool.tags.map(tag => (
                <span key={tag} className="text-[11px] bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 px-3 py-1.5 rounded-lg border dark:border-slate-700">#{tag}</span>
              ))}
            </div>
            <div className="pt-5 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between text-sm font-bold text-gray-400 dark:text-slate-500 group-hover:text-blue-600 transition-all">
              <span>Explore</span>
              <span>→</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}