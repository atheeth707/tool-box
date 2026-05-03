// Inside your AgenticAI component[cite: 19]
return (
  <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
    
    {/* 1. Show Result FIRST if it exists */}
    {response && (
      <div className="bg-white dark:bg-[#0f0f0f] border-2 border-blue-500/20 rounded-3xl p-6 md:p-8 shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
          <div className="flex items-center gap-2 text-xs font-black text-blue-500 uppercase tracking-widest">
            <Sparkles size={14} /> Generated Asset
          </div>
          {/* Add a download or share button here if needed */}
        </div>
        
        <div className="flex justify-center bg-gray-50 dark:bg-black/20 rounded-2xl overflow-hidden p-2">
          {response.startsWith('http') ? (
            mode === 'video' ? (
              <video src={response} controls className="max-w-full rounded-xl shadow-sm" />
            ) : (
              <img src={response} alt="Generated AI" className="max-w-full rounded-xl shadow-sm" />
            )
          ) : (
            <div className="prose dark:prose-invert max-w-none w-full p-4">
              <pre className="whitespace-pre-wrap font-sans text-lg">{response}</pre>
            </div>
          )}
        </div>
      </div>
    )}

    {/* 2. Control Panel (Mode Selector & Status) */}
    {/* ... (Keep existing Header/Tab buttons here[cite: 19]) ... */}

    {/* 3. Input Box at Bottom */}
    <div className="sticky bottom-4 bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-white/10 rounded-3xl p-4 shadow-2xl">
       {/* ... (Keep existing Input/Textarea logic[cite: 19]) ... */}
    </div>
  </div>
);