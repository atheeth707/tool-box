import { useEffect, useState } from 'react';
import { Sparkles, Coins, Plus, Lock, LogIn, Upload, Loader2, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AIStore() {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [storeItems, setStoreItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null); // For the "Enter Post" view
  const [upload, setUpload] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      const { data } = await supabase.from('profiles').select('credits').eq('id', session.user.id).single();
      if (data) setCredits(data.credits);
    }
    const { data: items } = await supabase.from('store_items').select('*').order('created_at', { ascending: false });
    if (items) setStoreItems(items);
  };

  const handleProcess = async () => {
    if (!upload || !selectedItem) return;
    setLoading(true);
    try {
      const res = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageBase64: upload.split(',')[1], 
          userId: user.id, 
          masterPrompt: selectedItem.hidden_prompt 
        })
      });
      const data = await res.json();
      if (data.output) {
        setResult(data.output);
        setCredits(data.newCredits);
      }
    } catch (e) { alert("Error"); }
    setLoading(false);
  };

  // 1. LOGIN VIEW
  if (!user) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
      <div className="max-w-sm w-full">
        <Sparkles className="mx-auto text-blue-500 mb-6" size={48} />
        <h1 className="text-3xl font-bold text-white mb-8">Access AI Store</h1>
        <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })} 
          className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
          <LogIn size={20} /> Continue with Google
        </button>
      </div>
    </div>
  );

  // 2. "INSIDE POST" VIEW (When user touches a post)
  if (selectedItem) return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 flex items-center gap-4 border-b border-white/10">
        <button onClick={() => { setSelectedItem(null); setUpload(null); setResult(null); }}><ChevronLeft /></button>
        <h1 className="font-bold">{selectedItem.title}</h1>
      </div>
      
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        <div className="aspect-video rounded-3xl overflow-hidden bg-zinc-900">
          {selectedItem.media_type === 'video' ? 
            <video src={selectedItem.media_url} autoPlay muted loop className="w-full h-full object-cover" /> :
            <img src={selectedItem.media_url} className="w-full h-full object-cover" />
          }
        </div>

        <div className="border-2 border-dashed border-white/10 rounded-3xl p-10 text-center">
          <input type="file" id="up" hidden onChange={(e:any) => {
            const reader = new FileReader();
            reader.onload = () => setUpload(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
          }} />
          <label htmlFor="up" className="cursor-pointer">
            {upload ? <img src={upload} className="h-48 mx-auto rounded-xl" /> : <div className="flex flex-col items-center gap-2 text-zinc-500"><Upload /> <span>Upload your image</span></div>}