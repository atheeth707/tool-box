import { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Coins, 
  Plus, 
  Lock, 
  LogIn, 
  Upload, 
  Loader2, 
  Zap, 
  ShieldCheck,
  Play
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { createProfile } from '../lib/createProfile';

export default function AIStore() {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [storeItems, setStoreItems] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
    fetchStoreItems();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setLoading(false);
      return;
    }
    setUser(session.user);
    
    // Ensure profile exists in Supabase
    await createProfile(session.user);

    // Fetch credits from user profile
    const { data } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', session.user.id)
      .single();

    if (data) setCredits(data.credits);
    setLoading(false);
  };

  const fetchStoreItems = async () => {
    const { data } = await supabase
      .from('store_items')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setStoreItems(data);
  };

  const handleImageUpload = (e: any) => {
    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result as string);
    reader.readAsDataURL(e.target.files[0]);
  };

  const generateAIResponse = async (hiddenPrompt: string, price: number) => {
    if (!selectedImage) return alert("Please upload an image first!");
    if (credits < price) return alert("Insufficient credits. Please top up.");
    
    setProcessing(true);
    const base64Data = selectedImage.split(',')[1];

    try {
      const res = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageBase64: base64Data, 
          userId: user.id, 
          masterPrompt: hiddenPrompt 
        })
      });

      const data = await res.json();
      if (data.output) {
        setResult(data.output);
        setCredits(data.newCredits);
      }
    } catch (err) {
      alert("Nexus connection lost. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/ai-store' }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-zinc-900/50 border border-white/5 p-10 rounded-[40px] text-center backdrop-blur-3xl shadow-2xl">
          <div className="w-20 h-20 bg-blue-600 rounded-[30px] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/20">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tighter">Nexus Intelligence</h1>
          <p className="text-zinc-500 mb-8 font-medium">Authentication required to access the creative store.</p>
          <button 
            onClick={handleLogin}
            className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-105 transition-all"
          >
            <LogIn size={20} />
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 pb-32">
      {/* Dynamic Header */}
      <nav className="sticky top-0 z-50 p-6 border-b border-white/5 bg-black/40 backdrop-blur-2xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Zap size={20} className="text-white fill-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Nexus Store</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2 rounded-full">
            <Coins size={16} className="text-yellow-500" />
            <span className="text-sm font-black">{credits}</span>
          </div>
          <button className="p-2 bg-blue-600 rounded-full hover:rotate-90 transition-all">
            <Plus size={20} />
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 mt-12 space-y-16">
        {/* Step 1: Secure Upload */}
        <div className="relative group bg-zinc-900/30 border-2 border-dashed border-white/5 rounded-[50px] p-16 text-center transition-all hover:border-blue-500/30">
          <input type="file" id="img-input" hidden onChange={handleImageUpload} />
          <label htmlFor="img-input" className="cursor-pointer flex flex-col items-center">
            {selectedImage ? (
              <img src={selectedImage} className="h-72 rounded-3xl shadow-2xl object-cover animate-in fade-in zoom-in duration-500" alt="Preview" />
            ) : (
              <>
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Upload className="text-zinc-600" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-1">Source Material</h3>
                <span className="text-zinc-500">Upload the image you want to transmute</span>
              </>
            )}
          </label>
        </div>

        {/* Step 2: Store Items (Admin Driven) */}
        <div>
          <div className="flex items-center gap-2 mb-8 opacity-50 uppercase tracking-[0.3em] text-[10px] font-black">
            <ShieldCheck size={14} /> Available Logics
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {storeItems.map((item) => (
              <div key={item.id} className="bg-zinc-900/50 border border-white/5 rounded-[40px] overflow-hidden group hover:border-blue-500/20 transition-all">
                <div className="h-56 relative overflow-hidden">
                  {item.media_type === 'video' ? (
                    <video src={item.media_url} autoPlay muted loop className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  ) : (
                    <img src={item.media_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={item.title} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
                  {item.media_type === 'video' && <Play className="absolute top-4 right-4 text-white/20" size={16} />}
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold tracking-tighter">{item.title}</h3>
                    <div className="flex items-center gap-1.5 text-yellow-500 font-black">
                      <Coins size={14} /> {item.price}
                    </div>
                  </div>

                  <button 
                    onClick={() => generateAIResponse(item.hidden_prompt, item.price)}
                    disabled={processing || credits < item.price}
                    className="w-full py-4 rounded-2xl bg-white text-black font-extrabold flex items-center justify-center gap-3 transition-all hover:bg-blue-600 hover:text-white disabled:opacity-20"
                  >
                    {credits < item.price ? <Lock size={18} /> : <Sparkles size={18} />}
                    {credits < item.price ? 'Locked' : 'Execute Logic'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Neural Output */}
        {(processing || result) && (
          <div className="bg-white text-black p-10 rounded-[50px] shadow-2xl animate-in slide-in-from-bottom-10 duration-700">
             <div className="flex items-center gap-2 mb-6 text-zinc-400 uppercase text-[10px] font-black tracking-widest italic">
               <Zap size={12} className="fill-zinc-400"/> Synthesis Results
             </div>
             {processing ? (
               <div className="flex items-center gap-4 py-4">
                 <Loader2 className="animate-spin" size={24} />
                 <span className="font-bold text-lg animate-pulse">Consulting Nexus Engine...</span>
               </div>
             ) : (
               <p className="text-2xl font-medium leading-relaxed tracking-tight">{result}</p>
             )}
          </div>
        )}
      </div>
    </div>
  );
}