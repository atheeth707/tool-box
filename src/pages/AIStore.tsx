import { useEffect, useState } from 'react';
import { Sparkles, Coins, Plus, Lock, LogIn, Upload, Loader2, ChevronLeft, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { createProfile } from '../lib/createProfile';

export default function AIStore() {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [storeItems, setStoreItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [upload, setUpload] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      await createProfile(session.user);
      const { data } = await supabase.from('profiles').select('credits').eq('id', session.user.id).single();
      if (data) setCredits(data.credits);
    }
    const { data: items } = await supabase.from('store_items').select('*').order('created_at', { ascending: false });
    if (items) setStoreItems(items);
    setPageLoading(false);
  };

  // Helper to resize image to 1024x1024 using Canvas
  const resizeImage = (base64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Fill background black to satisfy SDXL
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, 1024, 1024);
          // Draw image centered
          const ratio = Math.min(1024 / img.width, 1024 / img.height);
          const nw = img.width * ratio;
          const nh = img.height * ratio;
          ctx.drawImage(img, (1024 - nw) / 2, (1024 - nh) / 2, nw, nh);
          resolve(canvas.toDataURL('image/png').split(',')[1]);
        }
      };
    });
  };

  const handleProcess = async () => {
    if (!upload || !selectedItem) return;
    setLoading(true);
    setResult(null);

    try {
      const resizedBase64 = await resizeImage(upload);
      
      const res = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageBase64: resizedBase64, 
          userId: user.id, 
          masterPrompt: selectedItem.hidden_prompt 
        })
      });

      const data = await res.json();
      if (data.output) {
        setResult(data.output);
        setCredits(data.newCredits);
      } else {
        alert(data.error || "Generation failed.");
      }
    } catch (e) {
      alert("Nexus connection error.");
    }
    setLoading(false);
  };

  if (pageLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

  if (!user) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
      <div className="max-w-sm w-full">
        <Sparkles className="mx-auto text-blue-500 mb-6" size={48} />
        <h1 className="text-3xl font-bold text-white mb-8 italic uppercase tracking-tighter">Nexus AI</h1>
        <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })} 
          className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95">
          <LogIn size={20} /> Continue with Google
        </button>
      </div>
    </div>
  );

  if (selectedItem) return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 flex items-center gap-4 border-b border-white/10 sticky top-0 bg-black z-50">
        <button onClick={() => { setSelectedItem(null); setUpload(null); setResult(null); }} className="p-2 hover:bg-white/10 rounded-full">
          <ChevronLeft />
        </button>
        <h1 className="font-bold text-lg">{selectedItem.title}</h1>
      </div>
      
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        <div className="aspect-video rounded-[35px] overflow-hidden bg-zinc-900 shadow-2xl border border-white/5">
          {selectedItem.media_type === 'video' ? 
            <video src={selectedItem.media_url} autoPlay muted loop className="w-full h-full object-cover" /> :
            <img src={selectedItem.media_url} className="w-full h-full object-cover" alt={selectedItem.title} />
          }
        </div>

        <div className="border-2 border-dashed border-white/10 rounded-[35px] p-10 text-center bg-zinc-900/30">
          <input type="file" id="up" hidden onChange={(e: any) => {
            const reader = new FileReader();
            reader.onload = () => setUpload(reader.result as string);
            if (e.target.files?.[0]) reader.readAsDataURL(e.target.files[0]);
          }} />
          <label htmlFor="up" className="cursor-pointer">
            {upload ? (
              <img src={upload} className="h-48 mx-auto rounded-2xl shadow-lg border-2 border-white/20" alt="Preview" />
            ) : (
              <div className="flex flex-col items-center gap-3 text-zinc-500 py-4">
                <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center border border-white/10"><Upload size={20} /></div>
                <span className="font-bold text-white">Select Photo</span>
              </div>
            )}
          </label>
        </div>

        <button onClick={handleProcess} disabled={loading || !upload || credits < selectedItem.price} 
          className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase tracking-widest text-xs disabled:opacity-20 flex justify-center items-center gap-2 hover:bg-blue-700 transition-all">
          {loading ? <Loader2 className="animate-spin" /> : (
            <>
              {credits < selectedItem.price ? <Lock size={18} /> : <Sparkles size={18} />}
              {credits < selectedItem.price ? 'Insufficient Credits' : `Confirm Generation (${selectedItem.price} CR)`}
            </>
          )}
        </button>

        {result && (
          <div className="space-y-6 pt-10 animate-in fade-in zoom-in slide-in-from-bottom-10">
            <div className="rounded-[35px] overflow-hidden border border-white/10 shadow-2xl">
              <img src={result} className="w-full h-auto" alt="AI Transformation" />
            </div>
            <a href={result} download="nexus_style.png" className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200">
              <Download size={18} /> Download High-Res
            </a>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="p-6 flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-md z-50 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Sparkles className="text-blue-500" size={20} />
          <span className="text-xl font-black italic tracking-tighter uppercase">AI Store</span>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900 px-4 py-2 rounded-full border border-white/10 shadow-lg">
          <Coins size={14} className="text-yellow-500" />
          <span className="font-bold text-sm">{credits}</span>
          <button className="ml-1 text-blue-500"><Plus size={16} /></button>
        </div>
      </nav>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 p-1">
        {storeItems.map((item) => (
          <div key={item.id} onClick={() => setSelectedItem(item)} className="relative aspect-square cursor-pointer group overflow-hidden bg-zinc-900">
            {item.media_type === 'video' ? 
              <video src={item.media_url} autoPlay muted loop className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" /> :
              <img src={item.media_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt={item.title} />
            }
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <h3 className="font-bold text-xl tracking-tighter italic uppercase">{item.title}</h3>
              <div className="bg-white/10 px-3 py-1.5 rounded-xl text-[10px] font-black border border-white/10">
                {item.price} CR
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}