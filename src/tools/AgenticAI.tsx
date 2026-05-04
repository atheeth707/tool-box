import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Zap, Trash2, User, Sparkles } from 'lucide-react';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [mode, setMode] = useState<'chat' | 'image'>('chat');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;
    
    const userMsg = { role: 'user', content: prompt, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setPrompt('');

    try {
      const res = await fetch('/api/agent_9', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg.content, mode }),
      });

      if (mode === 'image') {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.data || data.error, type: data.error ? 'text' : 'image' }]);
      } else {
        // Handle Streaming Text
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let assistantText = "";
        
        setMessages(prev => [...prev, { role: 'assistant', content: "", type: 'text' }]);

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          lines.forEach(line => {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.replace('data: ', ''));
                const content = data.candidates[0].content.parts[0].text;
                assistantText += content;
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1].content = assistantText;
                  return newMsgs;
                });
              } catch (e) {}
            }
          });
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Protocol bypass failed. Please verify API keys.", type: 'text' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans">
      <div className="flex-grow flex flex-col items-center">
        
        <div className="w-full border-b border-white/5 p-5 flex justify-between items-center bg-zinc-950/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              <Zap size={16} className="text-black fill-black" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.6em]">Nexus Stream</span>
          </div>
          <button onClick={() => setMessages([])} className="p-2 hover:bg-white/5 rounded-lg opacity-20 hover:opacity-100 transition-all">
            <Trash2 size={16} />
          </button>
        </div>

        <div className="w-full max-w-3xl flex-grow overflow-y-auto p-8 space-y-10" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-5 animate-in fade-in duration-500 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-grow ${m.role === 'user' ? 'text-right' : ''}`}>
                {m.type === 'image' ? (
                  <img src={m.content} className="rounded-2xl border border-white/10 w-full shadow-2xl" alt="Nexus Output" />
                ) : (
                  <div className={`inline-block p-5 rounded-2xl text-[14px] leading-relaxed ${m.role === 'user' ? 'bg-white text-black font-semibold' : 'bg-zinc-900 text-zinc-300 border border-white/5'}`}>
                    {m.content}
                    {loading && m.content === "" && <Loader2 size={14} className="animate-spin opacity-50" />}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full max-w-2xl p-8">
          <div className="bg-zinc-900/40 border border-white/10 rounded-[2rem] p-2 backdrop-blur-3xl">
            <div className="flex gap-1 mb-2">
              {['chat', 'image'].map(t => (
                <button key={t} onClick={() => setMode(t as any)} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${mode === t ? 'bg-white text-black' : 'text-zinc-600'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 px-4 pb-2">
              <input 
                value={prompt} 
                onChange={e => setPrompt(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
                placeholder="Initialize protocol..." 
                className="flex-grow bg-transparent py-2 outline-none text-sm text-zinc-200 placeholder-zinc-800" 
              />
              <button onClick={handleSend} disabled={loading} className="bg-white text-black p-3 rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-10">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}