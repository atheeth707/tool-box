import { useState } from "react";
import { Icon } from "../components/Icon";

type Tool = {
  name: string;
  url: string;
  type: "Free" | "Freemium" | "Paid";
  tags: string[];
};

const tools: Tool[] = [
  { name: "Runway ML", url: "https://runwayml.com", type: "Freemium", tags: ["text-to-video"] },
  { name: "Pika Labs", url: "https://pika.art", type: "Freemium", tags: ["animation"] },
  { name: "Luma AI", url: "https://lumalabs.ai", type: "Freemium", tags: ["3D", "realistic"] },
];

export default function AIVideoTools() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = tools.filter(tool => {
    const matchFilter = filter === "All" || tool.type === filter;
    const matchSearch = tool.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans bg-[#fbfcfd] min-h-screen">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 bg-clip-text text-transparent">AI Video Magic</h1>
        <p className="text-gray-500 text-lg">Animate your ideas with the latest AI models.</p>
      </div>

      <div className="relative mb-10 group max-w-3xl mx-auto">
        <input
          type="text"
          placeholder="Search video AI..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-5 pl-14 border rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500 outline-none text-gray-700 bg-white"
        />
        <span className="absolute left-5 top-5 text-gray-400">🔍</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((tool, i) => (
          <a key={i} href={tool.url} target="_blank" rel="noopener noreferrer" className="group relative p-8 bg-white border border-gray-50 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16"></div>
            <div className="relative flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl text-gray-700 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <Icon name="video" className="w-6 h-6" />
                </div>
                <h2 className="font-bold text-2xl text-gray-800">{tool.name}</h2>
              </div>
              <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-black bg-orange-50 text-orange-600">
                {tool.type}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {tool.tags.map(tag => (
                <span key={tag} className="text-[11px] bg-gray-50 text-gray-400 px-3 py-1.5 rounded-lg border">#{tag}</span>
              ))}
            </div>
            <div className="pt-5 border-t border-gray-50 flex items-center justify-between text-sm font-bold text-gray-400 group-hover:text-orange-600 transition-all">
              <span>Create Video</span>
              <span>→</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}