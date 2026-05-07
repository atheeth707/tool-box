import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, Plus, Trash2, Loader2, LayoutDashboard } from 'lucide-react';

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', hidden_prompt: '', price: 1, media_type: 'image' });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // CHANGE THIS TO YOUR GOOGLE EMAIL
  const ADMIN_EMAIL = "your-email@gmail.com"; 

  useEffect(() => {
    checkUser();
    fetchItems();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    setAuthLoading(false);
  };

  const fetchItems = async () => {
    const { data } = await supabase.from('store_items').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let media_url = '';

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('thumbnails').upload(fileName, file);
      
      if (error) {
        alert("Upload Error: " + error.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from('thumbnails').getPublicUrl(fileName);
      media_url = urlData.publicUrl;
    }

    const { error } = await supabase.from('store_items').insert([{ ...form, media_url }]);
    
    if (error) {
      alert("Database Error: " + error.message);
    } else {
      setForm({ title: '', hidden_prompt: '', price: 1, media_type: 'image' });
      setFile(null);
      fetchItems();
    }
    setLoading(false);
  };

  if (authLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
          <p className="text-zinc-500 mt-2">Only authorized administrators can access this panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-black italic tracking-tighter flex items-center gap-3">
            <LayoutDashboard className="text-blue-500" /> ADMIN CONTROL
          </h1>
        </div>

        <form onSubmit={handleAddItem} className="bg-zinc-900 border border-white/5 p-8 rounded-[40px] mb-16 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Style Name</label>
              <input 
                className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500 transition-colors" 
                placeholder="e.g. Cinematic 4K"
                value={form.title} 
                onChange={e => setForm({ ...form, title: e.target.value })} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Credit Cost</label>
              <input 
                type="number"
                className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none" 
                value={form.price} 
                onChange={e => setForm({ ...form, price: parseInt(e.target.value) })} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Hidden Master Prompt</label>
            <textarea 
              className="w-full bg-black border border-white/10 p-4 rounded-2xl h-32 outline-none focus:border-blue-500"
              placeholder="Tell the AI how to transform the image..."
              value={form.hidden_prompt} 
              onChange={e => setForm({ ...form, hidden_prompt: e.target.value })} 
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select 
              className="bg-black border border-white/10 p-4 rounded-2xl outline-none" 
              value={form.media_type} 
              onChange={e => setForm({ ...form, media_type: e.target.value })}
            >
              <option value="image">Thumbnail: Static Image</option>
              <option value="video">Thumbnail: Video (Auto-play)</option>
            </select>
            <input 
              type="file" 
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="bg-zinc-800 p-3 rounded-2xl text-sm"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black py-5 rounded-[25px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Plus size={20}/> Publish to Store</>}
          </button>
        </form>

        <h2 className="text-xl font-bold mb-6 opacity-30 uppercase tracking-[0.3em] italic">Active Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-zinc-900 rounded-3xl overflow-hidden border border-white/5">
              <div className="h-40 bg-black relative">
                {item.media_type === 'video' ? 
                  <video src={item.media_url} autoPlay muted loop className="w-full h-full object-cover opacity-50" /> :
                  <img src={item.media_url} className="w-full h-full object-cover opacity-50" />
                }
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="font-bold truncate mr-2">{item.title}</span>
                <button className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}