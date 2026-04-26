import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { category, popular, search, limit } = req.query;
      let query = supabase.from('tools').select('*');
      
      if (category) query = query.eq('category_id', category);
      if (popular === 'true') query = query.order('views', { ascending: false }).limit(parseInt(limit) || 10);
      else query = query.order('name');
      
      if (search) query = query.ilike('name', `%${search}%`);
      
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    
    if (req.method === 'POST') {
      // Increment views
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'Missing id' });
      
      const { data: tool, error: fetchError } = await supabase.from('tools').select('views').eq('id', id).single();
      if (fetchError) throw fetchError;
      
      if (tool) {
        const { data, error } = await supabase.from('tools').update({ views: tool.views + 1 }).eq('id', id).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      return res.status(404).json({ error: 'Tool not found' });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
