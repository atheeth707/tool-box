import { useState } from "react";
import { Icon } from "../components/Icon";

type Tool = {
  name: string;
  url: string;
  type: "Free" | "Freemium" | "Paid";
  category: "SEO & Keywords" | "Script & Ideas" | "Video & Voice" | "Analytics";
  tags: string[];
};

const tools: Tool[] = [
  { name: "vidIQ", url: "https://vidiq.com", type: "Freemium", category: "SEO & Keywords", tags: ["youtube", "keywords", "competitors"] },
  { name: "Tube Buddy", url: "https://www.tubebuddy.com", type: "Freemium", category: "SEO & Keywords", tags: ["extension", "management", "seo"] },
  { name: "Answer The Public", url: "https://answerthepublic.com", type: "Freemium", category: "SEO & Keywords", tags: ["search trends", "ideas"] },
  { name: "Ahrefs Keyword Explorer", url: "https://ahrefs.com/keyword-generator", type: "Free", category: "SEO & Keywords", tags: ["google", "youtube seo"] },
  { name: "AI YT Title Generator", url: "https://tool-box-free.vercel.app/tool/yt-title-generator", type: "Free", category: "Script & Ideas", tags: ["viral titles", "no-signup"] },
  { name: "Insta Caption Gen", url: "https://tool-box-free.vercel.app/tool/instagram-caption-generator", type: "Free", category: "Script & Ideas", tags: ["instagram", "captions"] },
  { name: "ChatGPT", url: "https://chat.openai.com", type: "Freemium", category: "Script & Ideas", tags: ["scripts", "brainstorming"] },
  { name: "Claude AI", url: "https://claude.ai", type: "Freemium", category: "Script & Ideas", tags: ["long-form", "creative"] },
  { name: "ATXP.ai", url: "https://atxp.ai", type: "Freemium", category: "Script & Ideas", tags: ["agent-protocol", "automation"] },
  { name: "Jasper AI", url: "https://www.jasper.ai", type: "Paid", category: "Script & Ideas", tags: ["marketing", "copywriting"] },
  { name: "Copy.ai", url: "https://www.copy.ai", type: "Freemium", category: "Script & Ideas", tags: ["social media", "blogging"] },
  { name: "ElevenLabs", url: "https://elevenlabs.io", type: "Freemium", category: "Video & Voice", tags: ["voiceover", "realistic"] },
  { name: "HeyGen", url: "https://www.heygen.com", type: "Freemium", category: "Video & Voice", tags: ["avatar", "talking head"] },
  { name: "Pictory", url: "https://pictory.ai", type: "Paid", category: "Video & Voice", tags: ["script to video"] },
  { name: "Descript", url: "https://www.descript.com", type: "Freemium", category: "Video & Voice", tags: ["editing", "podcasting"] },
  { name: "Lovo.ai", url: "https://lovo.ai", type: "Freemium", category: "Video & Voice", tags: ["voice cloning"] },
  { name: "Thumbnail Check", url: "https://thumbnailcheck.com", type: "Free", category: "Analytics", tags: ["ab testing", "preview"] },
  { name: "Social Blade", url: "https://socialblade.com", type: "Free", category: "Analytics", tags: ["stats", "growth"] },
  { name: "ViewStats", url: "https://www.viewstats.com", type: "Free", category: "Analytics", tags: ["stats"] },
];

export default function AIContentTools() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const filtered = tools.filter(t => (filter === "All" || t.type === filter) && (t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="p-4 max-w-6xl mx-auto font-sans dark:bg-slate-950">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">Content Hub</h1>
      </div>
      <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full p-3 mb-6 rounded-xl border dark:bg-slate-900 dark:border-slate-800 outline-none text-sm" />
      <div className="flex gap-2 mb-6 justify-center">
        {["All", "Free", "Freemium", "Paid"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${filter === f ? "bg-gray-900 text-white dark:bg-blue-600" : "bg-white border dark:bg-slate-900 text-gray-500"}`}>{f}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((tool, i) => (
          <a key={i} href={tool.url} target="_blank" className="p-4 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-bold text-sm truncate dark:text-white">{tool.name}</h2>
              <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-black">{tool.type}</span>
            </div>
            <p className="text-[9px] text-blue-500 font-bold mb-3 uppercase">{tool.category}</p>
            <div className="flex flex-wrap gap-1">
              {tool.tags.slice(0, 2).map(tag => <span key={tag} className="text-[9px] bg-gray-50 dark:bg-slate-800 px-2 py-0.5 rounded text-gray-400">#{tag}</span>)}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}