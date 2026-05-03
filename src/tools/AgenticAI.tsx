import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2, Send, User, Bot, Zap, Plus } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AgenticAI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(0);
  const [user, setUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: hist } = await supabase.from('chat_sessions').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
        if (hist) setSessions(hist);
        const { data: prof } = await supabase.from('profiles').select('credits').eq('id', session.user.id).single();
        if (prof) setCredits(prof.credits);
      }
    };
    init();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim() || !user || credits < 1) return;
    
    const userPrompt = prompt;
    setMessages(prev => [...prev, { role: 'user', content: userPrompt }]);
    setLoading(true);
    setPrompt('');

    try {
      const response = await fetch('/api/agent', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      const data = await response.json();
      const aiText = data.text || "Connection to AI failed.";

      let i = 0;
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      const timer = setInterval(() => {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = aiText.substring(0, i);
          return updated;
        });
        i += 10;
        if (i > aiText.length) { clearInterval(timer); setLoading(false); }
      }, 15);

      // Deduct Credits
      await supabase.from('profiles').update({ credits: credits - 1 }).eq('id', user.id);
      setCredits(prev => prev - 1);

    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: AI Service Timeout." }]);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar and Chat logic remains the same as[cite: 2] */}
      <div className="flex-grow flex flex-col relative">
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6">
           {messages.map((msg, i) => (
             <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-blue-600' : 'bg-white/10 border border-white/10'}`}>
                  {msg.content}
                </div>
             </div>
           ))}
        </div>
        <div className="p-6 bg-black">
          <div className="max-w-3xl mx-auto flex gap-2">
            <textarea 
              value={prompt} 
              onChange={e => setPrompt(e.target.value)}
              className="flex-grow bg-[#111] border border-white/10 rounded-xl p-3 outline-none" 
              placeholder="Message AI..."
            />
            <button onClick={handleGenerate} className="bg-blue-600 p-4 rounded-xl"><Send size={20}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}