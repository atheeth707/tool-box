import { useState } from "react";

type Tool = {
  name: string;
  url: string;
  type: "Free" | "Freemium" | "Paid";
  category: string;
  tags: string[];
  region?: string;
};

const tools: Tool[] = [
  // 🔥 FREE
  { name: "Bing Image Creator", url: "https://www.bing.com/images/create", type: "Free", category: "Image", tags: ["realistic", "general"], region: "Global" },
  { name: "Craiyon", url: "https://www.craiyon.com", type: "Free", category: "Image", tags: ["fun", "experimental"], region: "Global" },
  { name: "Playground AI", url: "https://playgroundai.com", type: "Free", category: "Image", tags: ["art", "design"], region: "Global" },
  { name: "Mage Space", url: "https://www.mage.space", type: "Free", category: "Image", tags: ["uncensored", "anime"], region: "Global" },
  { name: "Lexica Art", url: "https://lexica.art", type: "Free", category: "Search + Generate", tags: ["prompt", "gallery"], region: "Global" },

  // ⚡ FREEMIUM
  { name: "Leonardo AI", url: "https://leonardo.ai", type: "Freemium", category: "Image", tags: ["game assets", "anime", "3D"], region: "Global" },
  { name: "Ideogram", url: "https://ideogram.ai", type: "Freemium", category: "Image", tags: ["text in image"], region: "Global" },
  { name: "Krea AI", url: "https://krea.ai", type: "Freemium", category: "Image", tags: ["realtime", "enhancer"], region: "Global" },
  { name: "Recraft AI", url: "https://www.recraft.ai", type: "Freemium", category: "Design", tags: ["logo", "vector"], region: "Global" },
  { name: "NightCafe", url: "https://nightcafe.studio", type: "Freemium", category: "Art", tags: ["community", "styles"], region: "Global" },
  { name: "Artbreeder", url: "https://www.artbreeder.com", type: "Freemium", category: "Face/Art", tags: ["faces", "genetics"], region: "Global" },
  { name: "Adobe Firefly", url: "https://firefly.adobe.com", type: "Freemium", category: "Design", tags: ["commercial", "safe"], region: "Limited (VPN may help)" },
  { name: "Canva AI", url: "https://www.canva.com", type: "Freemium", category: "Design", tags: ["social media"], region: "Global" },

  // 💎 PAID
  { name: "Midjourney", url: "https://www.midjourney.com", type: "Paid", category: "Art", tags: ["high quality", "discord"], region: "Global" },
  { name: "DALL·E", url: "https://openai.com", type: "Paid", category: "Image", tags: ["realistic"], region: "Global" },
  { name: "Runway ML", url: "https://runwayml.com", type: "Paid", category: "Image + Video", tags: ["gen-2", "film"], region: "Global" },

  // 🧠 SPECIAL / DIRECTORY / COMPARISON
  { name: "LM Arena", url: "https://lmarena.ai", type: "Free", category: "Compare", tags: ["model ranking"], region: "Global" },
  { name: "DesignArena", url: "https://designarena.ai", type: "Free", category: "Directory", tags: ["tools list"], region: "Global" },
  { name: "HuggingFace Spaces", url: "https://huggingface.co/spaces", type: "Free", category: "Open Models", tags: ["open-source"], region: "Global" },
];

export default function AIImageTools() {
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
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🔥 AI Image Generation Tools</h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search tools, tags (anime, logo, realistic...)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-6 border rounded-xl"
      />

      {/* FILTER */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {["All", "Free", "Freemium", "Paid"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl ${
              filter === f ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-5">
        {filtered.map((tool, i) => (
          <a
            key={i}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-white rounded-2xl shadow hover:scale-105 transition"
          >
            <h2 className="font-bold text-lg mb-1">{tool.name}</h2>

            <p className="text-xs text-gray-500 mb-2">
              {tool.type} • {tool.category}
            </p>

            <div className="flex flex-wrap gap-1 mb-2">
              {tool.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {tool.region && (
              <p className="text-[10px] text-gray-400">
                🌍 {tool.region}
              </p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}