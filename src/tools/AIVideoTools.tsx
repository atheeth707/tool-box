import { useState } from "react";

type Tool = {
  name: string;
  url: string;
  type: "Free" | "Freemium" | "Paid";
  tags: string[];
  region?: string;
};

const tools: Tool[] = [
  { name: "Runway ML", url: "https://runwayml.com", type: "Freemium", tags: ["text-to-video", "gen-2"], region: "Global" },
  { name: "Pika Labs", url: "https://pika.art", type: "Freemium", tags: ["animation"], region: "Global" },
  { name: "Kaiber AI", url: "https://kaiber.ai", type: "Freemium", tags: ["music video"], region: "Global" },
  { name: "HeyGen", url: "https://www.heygen.com", type: "Freemium", tags: ["avatar"], region: "Global" },
  { name: "Synthesia", url: "https://www.synthesia.io", type: "Paid", tags: ["ai presenter"], region: "Global" },
  { name: "PixVerse", url: "https://pixverse.ai", type: "Freemium", tags: ["text-to-video"], region: "Global" },
  { name: "Luma AI", url: "https://lumalabs.ai", type: "Freemium", tags: ["3D", "realistic"], region: "Limited (VPN may help)" },
  { name: "Invideo AI", url: "https://invideo.io", type: "Freemium", tags: ["youtube"], region: "Global" },

  // SPECIAL
  { name: "LM Arena", url: "https://lmarena.ai", type: "Free", tags: ["compare"], region: "Global" },
  { name: "DesignArena", url: "https://designarena.ai", type: "Free", tags: ["directory"], region: "Global" },
];

export default function AIVideoTools() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = tools.filter(tool => {
    const matchFilter = filter === "All" || tool.type === filter;
    const matchSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.tags.join(" ").toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🎬 AI Video Generators</h1>

      <input
        type="text"
        placeholder="Search video AI..."
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
            <p className="text-xs text-gray-400">{tool.tags.join(", ")}</p>
          </a>
        ))}
      </div>
    </div>
  );
}