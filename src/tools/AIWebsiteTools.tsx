import { useState } from "react";

type Tool = {
  name: string;
  url: string;
  type: "Free" | "Freemium" | "Paid";
  tags: string[];
  region?: string;
};

const tools: Tool[] = [
  { name: "Framer AI", url: "https://www.framer.com/ai", type: "Freemium", tags: ["design"], region: "Global" },
  { name: "Durable AI", url: "https://durable.co", type: "Freemium", tags: ["1-click site"], region: "Global" },

{ 
  name: "ATXP.ai", 
  url: "https://atxp.ai", 
  type: "Freemium", 
  category: "Script & Ideas", // or "AI Infrastructure"
  tags: ["agent-protocol", "llm-gateway", "automated-tools", "crypto-wallet"] 
},

  { name: "10Web AI", url: "https://10web.io", type: "Freemium", tags: ["wordpress"], region: "Global" },
  { name: "Wix AI", url: "https://www.wix.com/ai", type: "Freemium", tags: ["builder"], region: "Global" },
  { name: "Hostinger AI", url: "https://www.hostinger.com/ai-website-builder", type: "Paid", tags: ["fast"], region: "Global" },
  { name: "Webflow", url: "https://webflow.com", type: "Freemium", tags: ["pro"], region: "Global" },
  { name: "TeleportHQ", url: "https://teleporthq.io", type: "Freemium", tags: ["frontend"], region: "Global" },

  // SPECIAL
  { name: "LM Arena", url: "https://lmarena.ai", type: "Free", tags: ["compare"], region: "Global" },
  { name: "DesignArena", url: "https://designarena.ai", type: "Free", tags: ["directory"], region: "Global" },
];

export default function AIWebsiteTools() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = tools.filter(tool => {
    const matchFilter = filter === "All" || tool.type === filter;
    const matchSearch =
      tool.name.toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🌐 AI Website Builders</h1>

      <input
        type="text"
        placeholder="Search web AI..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-6 border rounded-xl"
      />

      <div className="flex gap-3 mb-6">
        {["All", "Free", "Freemium", "Paid"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl ${filter === f ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {filtered.map((tool, i) => (
          <a key={i} href={tool.url} target="_blank"
            className="p-4 bg-white rounded-2xl shadow hover:scale-105 transition">
            <h2 className="font-bold">{tool.name}</h2>
            <p className="text-sm text-gray-500">{tool.type}</p>
          </a>
        ))}
      </div>
    </div>
  );
}