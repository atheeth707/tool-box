import { supabase } from './supabase';

export async function createProfile(user: any) {

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (data) return;

  await supabase
    .from('profiles')
    .insert({

      id: user.id,

      name:
        user.user_metadata?.full_name || '',

      email: user.email,

      avatar_url:
        user.user_metadata?.avatar_url || '',

      credits: 10

    });

}