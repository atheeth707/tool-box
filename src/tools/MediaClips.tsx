import React from 'react';
import { Video, ImageIcon, Search, ExternalLink, Download } from 'lucide-react';

export default function MediaSourcingTools() {
  const resources = [
    {
      title: "StatusDP - Tamil Video Clips",
      description: "Direct source for Tamil movie clips, status videos, and high-quality raw footage.",
      link: "https://statusdp.com/",
      icon: <Video className="text-purple-500" />,
      tag: "Movie Clips"
    },
    {
      title: "Tenor - GIF & Meme Assets",
      description: "Search and download trending GIFs and short reaction clips for goofy edits.",
      link: "https://tenor.com/",
      icon: <ImageIcon className="text-blue-500" />,
      tag: "GIFs"
    },
    {
      title: "YouTube Search & Download",
      description: "Search for '4K Tamil Raw Clips' or 'No Copyright Scenes' and use your downloader tool.",
      link: "https://www.youtube.com/results?search_query=tamil+movie+clips+for+editing",
      icon: <Search className="text-red-500" />,
      tag: "YouTube"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Media Editing Assets</h1>
        <p className="text-gray-600 dark:text-gray-400">Quickly find and download movie clips, GIFs, and sound bites for your content.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                  {item.icon}
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                  {item.tag}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                {item.description}
              </p>
            </div>

            <a 
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
            >
              <span>Explore & Download</span>
              <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl">
        <h3 className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300 mb-2">
          <Download size={20} />
          Pro Tip for Creators
        </h3>
        <p className="text-blue-800/80 dark:text-blue-300/80 text-sm">
          To get the best quality, search for <strong>"Raw Clips"</strong> or <strong>"Log Footage"</strong> on these sites. This gives you more control over the colors and effects when you start editing in Premiere Pro or CapCut.
        </p>
      </div>
    </div>
  );
}