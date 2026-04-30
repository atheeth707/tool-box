import { useState } from "react";
import { Icon } from "../components/Icon";

const tools = [
  { name: "LM Arena", url: "https://chat.lmsys.org", type: "Free", category: "Arena", tags: ["benchmarks"] },
  { name: "Runway ML", url: "https://runwayml.com", type: "Freemium", category: "Video", tags: ["gen-3"] },
  { name: "Pika Labs", url: "https://pika.art", type: "Freemium", category: "Animation", tags: ["lip-sync"] },
  { name: "Luma AI", url: "https://lumalabs.ai", type: "Freemium", category: "Video", tags: ["dream"] },
  { name: "HeyGen", url: "https://www.heygen.com", type: "Freemium", category: "Avatar", tags: ["talking head"] },
  { name: "Sora", url: "https://openai.com/sora", type: "Paid", category: "Video", tags: ["upcoming"] },
  { name: "Kling AI", url: "https://klingai.com", type: "Freemium", category: "Video", tags: ["cinematic"] },
  { name: "Kaiber", url: "https://kaiber.ai", type: "Paid", category: "Art", tags: ["music"] },
  { name: "Synthesia", url: "https://www.synthesia.io", type: "Paid", category: "Presenter", tags: ["enterprise"] },
  { name: "InVideo AI", url: "https://invideo.io", type: "Freemium", category: "Editor", tags: ["stock"] },
  { name: "CapCut AI", url: "https://www.capcut.com", type: "Free", category: "Editor", tags: ["tiktok"] },
  { name: "Wonder Dyn", url: "https://wonderdynamics.com", type: "Paid", category: "VFX", tags: ["cgi"] },
  { name: "D-ID", url: "https://www.d-id.com", type: "Freemium", category: "Avatar", tags: ["animation"] },
  { name: "DeepBrain", url: "https://www.deepbrain.io", type: "Paid", category: "Presenter", tags: ["news"] },
  { name: "Elai.io", url: "https://elai.io", type: "Freemium", category: "Video", tags: ["corporate"] },
  { name: "Minimax", url: "https://www.hailuoai.com/video", type: "Free", category: "Video", tags: ["fast"] },
];

export default function AIVideoTools() {
  const [search, setSearch] = useState("");
  const filtered = tools.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 max-w-5xl mx-auto dark:bg-slate-950">
      <h1 className="text-2xl font-black text-center mb-4 bg-gradient-to-r from-orange-50 to-purple-600 bg-clip-text text-transparent">Video Magic</h1>
      <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full p-2 mb-6 rounded-lg border dark:bg-slate-900 dark:border-slate-800 text-sm" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {filtered.map((tool, i) => (
          <a key={i} href={tool.url} target="_blank" className="p-3 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl">
            <h2 className="font-bold text-xs truncate dark:text-white mb-1">{tool.name}</h2>
            <div className="flex justify-between items-center">
              <span className="text-[7px] uppercase font-black text-orange-600">{tool.type}</span>
              <span className="text-[7px] text-gray-400">#{tool.tags[0]}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}