import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, ImageIcon, Video, MessageSquare, User, Bot, Loader2 } from 'lucide-react';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [mode, setMode] = useState<'chat' | 'image' | 'video'>('chat');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;

    const userMsg = { role: 'user', content: prompt, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setPrompt('');

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg.content, mode }),
      });

      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.data || data.text || data.error, 
        type: data.type || 'text' 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered a connection error. Please try again.", type: 'text' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-zinc-200 font-sans">
      {/* Header */}
      <header className="p-4 border-b border-white/5 flex justify-between items-center bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-2 px-4">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Sparkles size={18} className="text-white" />
          </div>
          <h1 className="font-semibold tracking-tight text-white">Nexus Intelligence</h1>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto" ref={scrollRef}>
        <div className="max-w-3xl mx-auto py-10 px-6 space-y-8">
          {messages.length === 0 && (
            <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-4">
              <Bot size={48} className="text-zinc-700 animate-pulse" />
              <h2 className="text-2xl font-medium text-zinc-400">How can I help you today?</h2>
            </div>
          )}
          
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-zinc-700' : 'bg-blue-600'}`}>
                  {m.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                </div>
                <div className={`p-4 rounded-2xl leading-relaxed text-[15px] ${m.role === 'user' ? 'bg-zinc-800 text-white' : 'bg-transparent border border-white/10 text-zinc-300'}`}>
                  {m.type === 'image' && <img src={m.content} className="rounded-lg mb-2 shadow-2xl max-w-full" alt="AI Gen" />}
                  {m.type === 'video' && <video src={m.content} controls className="rounded-lg mb-2 w-full shadow-2xl" />}
                  <p>{m.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-4 items-center pl-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Loader2 size={16} className="animate-spin text-white" />
              </div>
              <p className="text-sm text-zinc-500 animate-pulse font-medium">Nexus is thinking...</p>
            </div>
          )}
        </div>
      </div>

      {/* Input Dock */}
      <div className="p-4 pb-8 bg-gradient-to-t from-black to-transparent">
        <div className="max-w-3xl mx-auto relative bg-zinc-900 border border-white/10 rounded-[28px] shadow-2xl overflow-hidden">
          {/* Mode Selector */}
          <div className="flex gap-1 p-2 bg-black/20 border-b border-white/5">
            {[
              { id: 'chat', icon: <MessageSquare size={14} />, label: 'Chat' },
              { id: 'image', icon: <ImageIcon size={14} />, label: 'Image' },
              { id: 'video', icon: <Video size={14} />, label: 'Video' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setMode(t.id as any)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${mode === t.id ? 'bg-zinc-100 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 p-3">
            <textarea
              rows={1}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Message Nexus (${mode} mode)...`}
              className="flex-grow bg-transparent p-2 outline-none text-sm resize-none"
            />
            <button
              onClick={handleSend}
              disabled={loading || !prompt.trim()}
              className="bg-zinc-100 text-black p-2.5 rounded-full hover:bg-white transition-all disabled:opacity-20"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        <p className="text-center text-[10px] text-zinc-600 mt-3 font-medium uppercase tracking-[0.2em]">Powered by Nexus v11.0</p>
      </div>
    </div>
  );
}