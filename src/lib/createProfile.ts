import { supabase } from './supabase';

export const createProfile = async (user: any) => {
  if (!user) return;

  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!data && !error) {
    // Profile doesn't exist, create it with 10 free credits
    await supabase.from('profiles').insert([
      { 
        id: user.id, 
        email: user.email, 
        credits: 10 
      }
    ]);
  }
};