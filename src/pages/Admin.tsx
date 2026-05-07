import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, Plus, Film, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function Admin() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', hidden_prompt: '', price: 1, media_type: 'image' });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const { data } = await supabase.from('store_items').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
  };

  const handleAddItem = async (e: any) => {
    e.preventDefault();
    let media_url = '';

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data } = await supabase.storage.from('thumbnails').upload(fileName, file);
      if (data) {
        const { data: urlData } = supabase.storage.from('thumbnails').getPublicUrl(fileName);
        media_url = urlData.publicUrl;
      }
    }

    await supabase.from('store_items').insert([{ ...form, media_url }]);
    setForm({ title: '', hidden_prompt: '', price: 1, media_type: 'image' });
    fetchItems();
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2"><Plus /> Admin: Post to Store</h1>

      <form onSubmit={handleAddItem} className="bg-zinc-900 p-6 rounded-3xl space-y-4 max-w-2xl mb-12 border border-white/5">
        <input placeholder="Style Title (e.g. 8K Cinematic)" className="w-full bg-black border border-white/10 p-3 rounded-xl" 
          value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        
        <textarea placeholder="The Hidden Prompt logic for the AI..." className="w-full bg-black border border-white/10 p-3 rounded-xl h-32"
          value={form.hidden_prompt} onChange={e => setForm({ ...form, hidden_prompt: e.target.value })} required />
        
        <div className="flex gap-4">
          <select className="bg-black border border-white/10 p-3 rounded-xl flex-grow" value={form.media_type} onChange={e => setForm({ ...form, media_type: e.target.value })}>
            <option value="image">Image Thumbnail</option>
            <option value="video">Video Thumbnail</option>
          </select>
          <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="text-sm" />
        </div>

        <button type="submit" className="w-full bg-blue-600 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">Publish to Store</button>
      </form>

      {/* List of Active Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 relative">
            {item.media_type === 'video' ? (
              <video src={item.media_url} autoPlay muted loop className="w-full h-48 object-cover opacity-50" />
            ) : (
              <img src={item.media_url} className="w-full h-48 object-cover opacity-50" />
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-zinc-500 text-xs truncate">{item.hidden_prompt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}