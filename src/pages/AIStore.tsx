import { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Coins, 
  Plus, 
  Lock, 
  LogIn, 
  Upload, 
  Loader2, 
  ChevronLeft,
  Download
} from 'lucide-react';
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

  const handleProcess = async () => {
    if (!upload || !selectedItem) return;
    setLoading(true);
    setResult(null); // Clear previous results
    
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
        setResult(data.output); // This will be the base64 image string from Stability AI
        setCredits(data.newCredits);
      } else if (data.error) {
        alert(data.error);
      }
    } catch (e) { 
      alert("Nexus connection lost. Check your API key or internet."); 
    }
    setLoading(false);
  };

  if (pageLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={32} />
    </div>
  );

  // 1. LOGIN VIEW
  if (!user) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center font-sans">
      <div className="max-w-sm w-full">
        <div className="w-20 h-20 bg-blue-600 rounded-[30px] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/20">
          <Sparkles className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">Nexus AI</h1>
        <p className="text-zinc-500 mb-8 font-medium">Log in to access premium generation styles.</p>
        <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })} 
          className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all">
          <LogIn size={20} /> Continue with Google
        </button>
      </div>
    </div>
  );

  // 2. DETAIL VIEW (After selecting a post)
  if (selectedItem) return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="p-4 flex items-center gap-4 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-xl z-50">
        <button onClick={() => { setSelectedItem(null); setUpload(null); setResult(null); }} className="p-2 hover:bg-white/10 rounded-full">
          <ChevronLeft />
        </button>
        <h1 className="font-bold text-lg">{selectedItem.title}</h1>
      </div>
      
      <div className="max-w-2xl mx-auto p-6 space-y-10 mt-4">
        {/* Thumbnail Preview */}
        <div className="aspect-video rounded-[40px] overflow-hidden bg-zinc-900 shadow-2xl border border-white/5">
          {selectedItem.media_type === 'video' ? 
            <video src={selectedItem.media_url} autoPlay muted loop className="w-full h-full object-cover" /> :
            <img src={selectedItem.media_url} className="w-full h-full object-cover" alt={selectedItem.title} />
          }
        </div>

        {/* Upload Box */}
        <div className="border-2 border-dashed border-white/10 rounded-[40px] p-12 text-center bg-zinc-900/30 transition-all hover:border-blue-500/50">
          <input type="file" id="up" hidden onChange={(e: any) => {
            const reader = new FileReader();
            reader.onload = () => setUpload(reader.result as string);
            if (e.target.files?.[0]) reader.readAsDataURL(e.target.files[0]);
          }} />
          <label htmlFor="up" className="cursor-pointer">
            {upload ? (
              <img src={upload} className="h-64 mx-auto rounded-3xl shadow-2xl border-4 border-white/10" alt="Preview" />
            ) : (
              <div className="flex flex-col items-center gap-4 text-zinc-500 py-6">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
                  <Upload size={24} />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Select Your Image</p>
                  <p className="text-sm">Tap to browse your gallery</p>
                </div>
              </div>
            )}
          </label>
        </div>

        {/* Generate Button */}
        <button onClick={handleProcess} disabled={loading || !upload || credits < selectedItem.price} 
          className="w-full bg-blue-600 py-5 rounded-3xl font-black uppercase tracking-widest text-sm disabled:opacity-20 flex justify-center items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
          {loading ? <Loader2 className="animate-spin" /> : (
            <>
              {credits < selectedItem.price ? <Lock size={18} /> : <Sparkles size={18} />}
              {credits < selectedItem.price ? 'Locked: Top Up Required' : `Transform Image (${selectedItem.price} CR)`}
            </>
          )}
        </button>

        {/* Stability AI Image Result */}
        {result && (
          <div className="space-y-6 pt-10 animate-in fade-in zoom-in slide-in-from-bottom-10 duration-700">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-blue-500" size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Synthesis Complete</span>
            </div>
            <div className="rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
              <img src={result} className="w-full h-auto" alt="AI Transformation" />
            </div>
            <a 
              href={result} 
              download={`${selectedItem.title}-nexus.png`}
              className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all"
            >
              <Download size={18} /> Download High-Res
            </a>
          </div>
        )}
      </div>
    </div>
  );

  // 3. MAIN GRID VIEW
  return (
    <div className="min-h-screen bg-black text-white pb-10">
      <nav className="p-6 flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-xl z-50 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <Sparkles className="text-white" size={18} />
          </div>
          <span className="text-xl font-black italic tracking-tighter uppercase">AI Store</span>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900/50 px-4 py-2 rounded-full border border-white/10 shadow-inner">
          <Coins size={14} className="text-yellow-500" />
          <span className="font-bold text-sm tracking-tight">{credits} Credits</span>
          <button className="ml-1 text-blue-500 hover:scale-110 transition-transform"><Plus size={16} /></button>
        </div>
      </nav>

      {/* Grid of Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 p-1">
        {storeItems.map((item) => (
          <div key={item.id} onClick={() => setSelectedItem(item)} className="relative aspect-square cursor-pointer group overflow-hidden bg-zinc-900 border border-white/5">
            {item.media_type === 'video' ? 
              <video src={item.media_url} autoPlay muted loop className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" /> :
              <img src={item.media_url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" alt={item.title} />
            }
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
            
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div className="space-y-1">
                <h3 className="font-bold text-xl tracking-tighter leading-none group-hover:text-blue-400 transition-colors uppercase italic">{item.title}</h3>
                <div className="flex items-center gap-1.5 opacity-50">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Touch to enter</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-2xl px-3 py-1.5 rounded-xl text-[10px] font-black border border-white/10 shadow-lg group-hover:bg-white group-hover:text-black transition-all">
                {item.price} CR
              </div>
            </div>
          </div>
        ))}
      </div>

      {storeItems.length === 0 && (
        <div className="py-40 text-center text-zinc-600">
          <Loader2 className="mx-auto animate-spin mb-4" />
          <p className="font-medium">Syncing with Nexus Store...</p>
        </div>
      )}
    </div>
  );
}