import { useState } from "react";
import { Icon } from "../components/Icon";

type Tool = {
  name: string;
  url: string;
  type: "Free" | "Freemium" | "Paid";
  tags: string[];
};

const tools: Tool[] = [
  { name: "LM Arena", url: "https://chat.lmsys.org", type: "Free", tags: ["chatbot-arena", "benchmarks"] },
  { name: "Runway ML", url: "https://runwayml.com", type: "Freemium", tags: ["gen-3 alpha", "text-to-video"] },
  { name: "Pika Labs", url: "https://pika.art", type: "Freemium", tags: ["animation", "lip-sync"] },
  { name: "Luma AI", url: "https://lumalabs.ai", type: "Freemium", tags: ["dream machine", "realistic"] },
  { name: "HeyGen", url: "https://www.heygen.com", type: "Freemium", tags: ["avatar", "talking head"] },
  { name: "Sora (OpenAI)", url: "https://openai.com/sora", type: "Paid", tags: ["photorealistic", "upcoming"] },
  { name: "Kling AI", url: "https://klingai.com", type: "Freemium", tags: ["cinematic", "1080p"] },
  { name: "Kaiber", url: "https://kaiber.ai", type: "Paid", tags: ["music videos", "stylized"] },
  { name: "Synthesia", url: "https://www.synthesia.io", type: "Paid", tags: ["enterprise", "presenters"] },
  { name: "InVideo AI", url: "https://invideo.io", type: "Freemium", tags: ["script-to-video", "stock"] },
  { name: "CapCut AI", url: "https://www.capcut.com", type: "Free", category: "Editor", tags: ["tiktok", "captions"] },
  { name: "Wonder Dynamics", url: "https://wonderdynamics.com", type: "Paid", tags: ["vfx", "cgi replacement"] },
  { name: "D-ID", url: "https://www.d-id.com", type: "Freemium", tags: ["animation", "historical photos"] },
  { name: "DeepBrain AI", url: "https://www.deepbrain.io", type: "Paid", tags: ["news", "kiosk"] },
  { name: "Elai.io", url: "https://elai.io", type: "Freemium", tags: ["training", "corporate"] },
  { name: "Minimax (Hailuo)", url: "https://www.hailuoai.com/video", type: "Free", tags: ["chinese model", "fast"] },
];

export default function AIVideoTools() {
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
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 bg-clip-text text-transparent">AI Video Magic</h1>
        <p className="text-gray-500 dark:text-slate-400 text-lg">Compare LLMs on LM Arena or animate cinematic scenes.</p>
      </div>

      <div className="relative mb-10 group max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <input
          type="text"
          placeholder="Search video AI or benchmarks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="relative w-full p-5 pl-14 border rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 transition-all"
        />
        <span className="absolute left-5 top-5 text-gray-400">🔍</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((tool, i) => (
          <a key={i} href={tool.url} target="_blank" rel="noopener noreferrer" className="group relative p-8 bg-white dark:bg-slate-900 border border-gray-50 dark:border-slate-800 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 dark:bg-orange-900/10 rounded-full -mr-16 -mt-16 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/20"></div>
            <div className="relative flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-700 dark:text-slate-300 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <Icon name="video" className="w-6 h-6" />
                </div>
                <h2 className="font-bold text-2xl text-gray-800 dark:text-slate-100 group-hover:text-orange-500">{tool.name}</h2>
              </div>
              <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-black bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                {tool.type}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {tool.tags.map(tag => (
                <span key={tag} className="text-[11px] bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 px-3 py-1.5 rounded-lg border dark:border-slate-700">#{tag}</span>
              ))}
            </div>
            <div className="pt-5 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between text-sm font-bold text-gray-400 dark:text-slate-500 group-hover:text-orange-600 transition-all">
              <span>View Tool</span>
              <span>→</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}