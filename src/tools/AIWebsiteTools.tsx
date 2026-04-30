import { useState } from "react";
import { Icon } from "../components/Icon";

const tools = [
  { name: "ATXP.ai", url: "https://atxp.ai", type: "Freemium", tags: ["automation"] },
  { name: "Framer AI", url: "https://www.framer.com/ai", type: "Freemium", tags: ["design"] },
  { name: "Durable AI", url: "https://durable.co", type: "Freemium", tags: ["1-click"] },
  { name: "10Web", url: "https://10web.io", type: "Paid", tags: ["hosting"] },
  { name: "Vercel V0", url: "https://v0.dev", type: "Freemium", tags: ["ui"] },
  { name: "Bolt.new", url: "https://bolt.new", type: "Freemium", tags: ["fullstack"] },
  { name: "Relume", url: "https://www.relume.io", type: "Freemium", tags: ["wireframe"] },
  { name: "Wix Studio", url: "https://www.wix.com/studio", type: "Paid", tags: ["pro"] },
  { name: "Webflow AI", url: "https://webflow.com", type: "Freemium", tags: ["cms"] },
  { name: "Softr AI", url: "https://www.softr.io", type: "Freemium", tags: ["internal"] },
  { name: "Hocoos AI", url: "https://hocoos.com", type: "Free", tags: ["instant"] },
  { name: "TeleportHQ", url: "https://teleporthq.io", type: "Freemium", tags: ["exports"] },
  { name: "Make.com", url: "https://www.make.com", type: "Freemium", tags: ["visual"] },
  { name: "Zapier", url: "https://zapier.com", type: "Freemium", tags: ["workflow"] },
  { name: "Replit Agent", url: "https://replit.com", type: "Paid", tags: ["assistant"] },
  { name: "Bubble AI", url: "https://bubble.io", type: "Paid", tags: ["complex"] },
];

export default function AIWebsiteTools() {
  const [search, setSearch] = useState("");
  const filtered = tools.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 max-w-5xl mx-auto dark:bg-slate-950">
      <h1 className="text-2xl font-black text-center mb-4 bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">Web & Auto</h1>
      <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full p-2 mb-6 rounded-lg border dark:bg-slate-900 text-sm" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {filtered.map((tool, i) => (
          <a key={i} href={tool.url} target="_blank" className="p-3 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl">
            <h2 className="font-bold text-xs truncate dark:text-white mb-1">{tool.name}</h2>
            <div className="flex justify-between items-center">
              <span className="text-[7px] text-blue-600 font-bold">{tool.type}</span>
              <span className="text-[7px] text-gray-400">#{tool.tags[0]}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}