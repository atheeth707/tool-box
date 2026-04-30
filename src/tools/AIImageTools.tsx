import { useState } from "react";
import { Icon } from "../components/Icon";

const tools = [
  { name: "Design Arena", url: "https://arena.midjourney.com", type: "Free", category: "Arena", tags: ["comparison"] },
  { name: "Bing Image", url: "https://www.bing.com/images/create", type: "Free", category: "Image", tags: ["dall-e 3"] },
  { name: "Leonardo AI", url: "https://leonardo.ai", type: "Freemium", category: "Image", tags: ["3D"] },
  { name: "Ideogram", url: "https://ideogram.ai", type: "Freemium", category: "Image", tags: ["typography"] },
  { name: "Midjourney", url: "https://www.midjourney.com", type: "Paid", category: "Art", tags: ["v6"] },
  { name: "Playground AI", url: "https://playground.ai", type: "Freemium", category: "Editor", tags: ["canvas"] },
  { name: "Lexica Art", url: "https://lexica.art", type: "Freemium", category: "Search", tags: ["prompts"] },
  { name: "BlueWillow", url: "https://www.bluewillow.ai", type: "Freemium", category: "Image", tags: ["discord"] },
  { name: "SeaArt AI", url: "https://www.seaart.ai", type: "Freemium", category: "Image", tags: ["models"] },
  { name: "Adobe Firefly", url: "https://firefly.adobe.com", type: "Freemium", category: "Design", tags: ["fill"] },
  { name: "Recraft.ai", url: "https://www.recraft.ai", type: "Freemium", category: "Vector", tags: ["svg"] },
  { name: "Krea AI", url: "https://www.krea.ai", type: "Freemium", category: "Upscale", tags: ["real-time"] },
  { name: "Tensor.art", url: "https://tensor.art", type: "Free", category: "Models", tags: ["sd"] },
  { name: "Civitai", url: "https://civitai.com", type: "Free", category: "Models", tags: ["community"] },
  { name: "NightCafe", url: "https://creator.nightcafe.studio", type: "Freemium", category: "Art", tags: ["challenges"] },
  { name: "Canva Magic", url: "https://www.canva.com", type: "Freemium", category: "Design", tags: ["integrated"] },
];

export default function AIImageTools() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const filtered = tools.filter(t => (filter === "All" || t.type === filter) && t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 max-w-6xl mx-auto dark:bg-slate-950">
      <h1 className="text-2xl font-black text-center mb-6 bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">Image Gen</h1>
      <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full p-2.5 mb-6 rounded-lg border dark:bg-slate-900 dark:border-slate-800 text-sm outline-none" />
      <div className="flex gap-2 mb-6 justify-center">
        {["All", "Free", "Freemium", "Paid"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-md text-[10px] font-bold ${filter === f ? "bg-emerald-600 text-white" : "bg-white border text-gray-500"}`}>{f}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {filtered.map((tool, i) => (
          <a key={i} href={tool.url} target="_blank" className="p-3 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl hover:scale-[1.02] transition-transform">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-xs truncate dark:text-white">{tool.name}</h2>
              <span className="text-[7px] font-bold text-emerald-500">{tool.type}</span>
            </div>
            <div className="flex gap-1">
              {tool.tags.slice(0, 1).map(tag => <span key={tag} className="text-[8px] text-gray-400">#{tag}</span>)}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}