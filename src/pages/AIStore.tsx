import { useEffect, useState } from 'react';

import {
  Sparkles,
  Plus,
  Coins,
  Lock
} from 'lucide-react';

import { supabase } from '../lib/supabase';

export default function AIStore() {

  const [user, setUser] = useState<any>(null);

  const [credits, setCredits] = useState(0);

  useEffect(() => {

    loadUser();

  }, []);

  const loadUser = async () => {

    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session?.user) return;

    setUser(session.user);

    const { data } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', session.user.id)
      .single();

    if (data) {
      setCredits(data.credits);
    }

  };

  const promptCards = [

    {
      title: 'Cinematic Portrait',
      price: 1
    },

    {
      title: 'Anime Style',
      price: 1
    },

    {
      title: 'Luxury Product Ad',
      price: 2
    },

    {
      title: 'YouTube Thumbnail',
      price: 1
    },

    {
      title: 'Movie Poster',
      price: 2
    },

    {
      title: 'AI Wallpaper',
      price: 1
    }

  ];

  return (

    <div className="min-h-screen bg-white dark:bg-black">

      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">

              <Sparkles className="w-5 h-5 text-white" />

            </div>

            <div>

              <h1 className="font-bold text-lg text-gray-900 dark:text-white">
                AI Store
              </h1>

              <p className="text-sm text-gray-500">
                Premium AI generations
              </p>

            </div>

          </div>

          {/* Credits */}
          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-500/10 px-4 py-2 rounded-2xl">

              <Coins className="w-4 h-4 text-yellow-600" />

              <span className="font-semibold text-gray-900 dark:text-white">

                {credits}

              </span>

            </div>

            <button className="w-11 h-11 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center transition-all">

              <Plus className="w-5 h-5" />

            </button>

          </div>

        </div>

      </div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-6">

        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white max-w-3xl leading-tight">

          Generate amazing AI content instantly.

        </h2>

        <p className="mt-5 text-gray-600 dark:text-gray-400 text-lg max-w-2xl">

          Premium prompts, viral styles and creative AI generations powered by credits.

        </p>

      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-20">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {promptCards.map((card, index) => (

            <div
              key={index}
              className="rounded-3xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:scale-[1.02] transition-all shadow-sm"
            >

              <div className="h-52 bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500"></div>

              <div className="p-6">

                <div className="flex items-center justify-between">

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">

                    {card.title}

                  </h3>

                  <div className="flex items-center gap-1 text-yellow-500 font-semibold">

                    <Coins className="w-4 h-4" />

                    {card.price}

                  </div>

                </div>

                <button
                  className="mt-6 w-full py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 transition-all text-white font-semibold flex items-center justify-center gap-2"
                >

                  {credits <= 0 ? (
                    <>
                      <Lock className="w-4 h-4" />
                      Buy Credits
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate
                    </>
                  )}

                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}