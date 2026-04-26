import { useState } from "react";

type Tool = {
  name: string;
  url: string;
  type: "Free" | "Freemium" | "Paid";
  category: string;
};

const tools: Tool[] = [
  // FREE
  { name: "Bing Image Creator", url: "https://www.bing.com/images/create", type: "Free", category: "Image" },
  { name: "Craiyon", url: "https://www.craiyon.com", type: "Free", category: "Image" },
  { name: "Stable Diffusion", url: "https://stability.ai", type: "Free", category: "Image" },
  { name: "Playground AI", url: "https://playgroundai.com", type: "Free", category: "Image" },
  { name: "Mage Space", url: "https://www.mage.space", type: "Free", category: "Image" },

  // FREEMIUM
  { name: "Leonardo AI", url: "https://leonardo.ai", type: "Freemium", category: "Image" },
  { name: "Canva AI", url: "https://www.canva.com", type: "Freemium", category: "Image" },
  { name: "Adobe Firefly", url: "https://firefly.adobe.com", type: "Freemium", category: "Image" },
  { name: "Ideogram", url: "https://ideogram.ai", type: "Freemium", category: "Image" },
  { name: "Krea AI", url: "https://krea.ai", type: "Freemium", category: "Image" },
  { name: "Recraft", url: "https://www.recraft.ai", type: "Freemium", category: "Image" },
  { name: "NightCafe", url: "https://nightcafe.studio", type: "Freemium", category: "Image" },
  { name: "Artbreeder", url: "https://www.artbreeder.com", type: "Freemium", category: "Image" },

  // PAID
  { name: "Midjourney", url: "https://www.midjourney.com", type: "Paid", category: "Image" },
  { name: "DALL·E", url: "https://openai.com", type: "Paid", category: "Image" },
  { name: "Runway ML", url: "https://runwayml.com", type: "Paid", category: "Image" },

  // SPECIAL
  { name: "LM Arena", url: "https://lmarena.ai", type: "Free", category: "Compare" },
  { name: "DesignArena", url: "https://designarena.ai", type: "Free", category: "Directory" },
];

export default function AIImageTools() {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All"
    ? tools
    : tools.filter(t => t.type === filter);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🔥 AI Image Tools</h1>

      {/* FILTER */}
      <div className="flex gap-3 mb-6">
        {["All", "Free", "Freemium", "Paid"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            {f}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-4">
        {filtered.map((tool, i) => (
          <a
            key={i}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-white rounded-2xl shadow hover:scale-105 transition"
          >
            <h2 className="font-bold text-lg">{tool.name}</h2>
            <p className="text-sm text-gray-500">{tool.type}</p>
          </a>
        ))}
      </div>
    </div>
  );
}