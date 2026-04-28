import { useState } from "react";
import { Icon } from "../components/Icon";

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
  { name: "Lexica Art", url: "https://lexica.art", type: "Free", category: "Search", tags: ["prompt", "gallery"], region: "Global" },

  // ⚡ FREEMIUM
  { name: "Leonardo AI", url: "https://leonardo.ai", type: "Freemium", category: "Image", tags: ["game assets", "anime", "3D"], region: "Global" },
  { name: "Ideogram", url: "https://ideogram.ai", type: "Freemium", category: "Image", tags: ["text in image"], region: "Global" },
  { name: "Krea AI", url: "https://krea.ai", type: "Freemium", category: "Image", tags: ["realtime", "enhancer"], region: "Global" },
  { name: "Recraft AI", url: "https://www.recraft.ai", type: "Freemium", category: "Design", tags: ["logo", "vector"], region: "Global" },
  { name: "NightCafe", url: "https://nightcafe.studio", type: "Freemium", category: "Art", tags: ["community", "styles"], region: "Global" },
  { name: "Adobe Firefly", url: "https://firefly.adobe.com", type: "Freemium", category: "Design", tags: ["commercial", "safe"], region: "Global" },

  // 💎 PAID
  { name: "Midjourney", url: "https://www.midjourney.com", type: "Paid", category: "Art", tags: ["high quality", "discord"], region: "Global" },
  { name: "DALL·E", url: "https://openai.com", type: "Paid", category: "Image", tags: ["realistic"], region: "Global" },
  { name: "Runway ML", url: "https://runwayml.com", type: "Paid", category: "Video", tags: ["gen-2", "film"], region: "Global" },
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
    <div className="p-6 max-w-7xl mx-auto font-sans bg-[#fbfcfd] min-h-screen">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 bg-clip-text text-transparent">
          AI Image Generators
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Create stunning visuals, art, and designs using next-generation generative AI.
        </p>
      </div>

      <div className="relative mb-10 group max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <input
          type="text"
          placeholder="Search by model name or style (anime, logo, realistic)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="relative w-full p-5 pl-14 border-0 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-gray-700 bg-white"
        />
        <span className="absolute left-5 top-5 text-gray-400">🔍</span>
      </div>

      <div className="flex gap-3 mb-10 flex-wrap justify-center">
        {["All", "Free", "Freemium", "Paid"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-8 py-2.5 rounded-xl font-bold transition-all duration-300 ${
              filter === f ? "bg-gray-900 text-white shadow-xl scale-105" : "bg-white text-gray-500 border border-gray-100 shadow-sm"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((tool, i) => (
          <a
            key={i}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-8 bg-white border border-gray-50 rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 group-hover: