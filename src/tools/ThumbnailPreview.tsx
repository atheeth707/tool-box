import { useState } from 'react';
import { Image as ImageIcon, PlaySquare } from 'lucide-react';

export default function ThumbnailPreview() {
  const [image, setImage] = useState('https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=1000&auto=format&fit=crop');
  const [title, setTitle] = useState('I Built The Ultimate App In 24 Hours');
  const [channel, setChannel] = useState('CodeMaster');
  const [views, setViews] = useState('1.2M');
  const [time, setTime] = useState('2 days ago');

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        <h2 className="text-2xl font-bold dark:text-white mb-6">Video Details</h2>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Thumbnail URL</label>
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-red-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Video Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-red-500 outline-none font-bold" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Channel Name</label>
          <input type="text" value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-red-500 outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Views</label>
            <input type="text" value={views} onChange={(e) => setViews(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-red-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Time</label>
            <input type="text" value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-red-500 outline-none" />
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 bg-gray-100 dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center">
        <h3 className="text-gray-500 font-bold mb-8 uppercase tracking-wider">YouTube Homepage Preview</h3>
        
        {/* YouTube Card Mock */}
        <div className="w-full max-w-[360px] bg-transparent cursor-pointer group">
          <div className="w-full aspect-video rounded-xl overflow-hidden relative mb-3 bg-gray-200 dark:bg-gray-800">
            {image ? (
              <img src={image} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => e.currentTarget.style.display = 'none'} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={48} /></div>
            )}
            <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs font-bold px-1.5 py-0.5 rounded">10:24</div>
          </div>
          
          <div className="flex items-start space-x-3 pr-6">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 shrink-0 mt-0.5"></div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight mb-1 line-clamp-2">{title}</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">{channel}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{views} views • {time}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
