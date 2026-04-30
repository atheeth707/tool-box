import { Sparkles, ExternalLink, Zap, ShieldCheck, MousePointer2 } from 'lucide-react';

export default function YtTitleGenerator() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Main Feature Card */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 text-center">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 dark:bg-red-900/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-lg shadow-red-500/20">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Professional AI Title Engine
          </h2>
          
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            We have partnered with <span className="text-red-600 font-bold">vidIQ</span> to provide you with the industry's most powerful YouTube title generator.
          </p>

          {/* Value Propositions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center gap-3 border border-gray-100 dark:border-gray-700">
              <Zap className="text-amber-500 w-5 h-5" />
              <span className="text-sm font-bold dark:text-gray-200">Free to Use</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center gap-3 border border-gray-100 dark:border-gray-700">
              <ShieldCheck className="text-emerald-500 w-5 h-5" />
              <span className="text-sm font-bold dark:text-gray-200">No Signup Required</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center gap-3 border border-gray-100 dark:border-gray-700">
              <MousePointer2 className="text-blue-500 w-5 h-5" />
              <span className="text-sm font-bold dark:text-gray-200">1-Click Access</span>
            </div>
          </div>

          {/* Action Button */}
          <a 
            href="https://vidiq.com/ai-title-generator/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-red-600/30 hover:scale-[1.02] active:scale-95"
          >
            Open Generator Now <ExternalLink size={24} />
          </a>
          
          <p className="mt-6 text-xs text-gray-400 uppercase tracking-widest font-bold">
            External Tool • Powered by vidIQ AI
          </p>
        </div>
      </div>

      {/* Helpful Tip Section */}
      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
        <h4 className="font-bold dark:text-white mb-2 flex items-center gap-2">
          <span className="bg-red-100 dark:bg-red-900/30 p-1 rounded-md text-red-600">💡</span> 
          Pro Tip for YouTube Titles
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          The best titles create a "Curiosity Gap." They tell the viewer what the video is about but leave enough out that they <strong>must</strong> click to find the answer. Use the vidIQ tool to generate at least 5 options and pick the one with the highest emotional impact.
        </p>
      </div>
    </div>
  );
}