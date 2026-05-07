import { useEffect, useState } from 'react';

import {
  Sparkles,
  Coins,
  Plus,
  Lock,
  LogIn
} from 'lucide-react';

import { supabase } from '../lib/supabase';
import { createProfile } from '../lib/createProfile';

export default function AIStore() {

  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  const [generating, setGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {

    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      setLoading(false);
      return;
    }

    setUser(session.user);

    await createProfile(session.user);

    const { data } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', session.user.id)
      .single();

    if (data) setCredits(data.credits);

    setLoading(false);
  };

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/ai-store'
      }
    });
  };

  // STYLE SELECTOR (hidden brain)
  const getStyle = (title: string) => {

    const t = title.toLowerCase();

    if (t.includes("anime")) return "anime";
    if (t.includes("cinematic")) return "cinematic";
    if (t.includes("luxury")) return "luxury";
    if (t.includes("poster")) return "poster";
    if (t.includes("thumbnail")) return "thumbnail";

    return "cinematic";
  };

  // GENERATE IMAGE
  const generateImage = async (card: any) => {

    if (!user || credits <= 0 || generating) return;

    try {

      setGenerating(true);
      setError("");
      setResultImage(null);

      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.id,
          prompt: card.title,
          style: getStyle(card.title)
        })
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setResultImage(data.image);

      // refresh credits
      const { data: updated } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (updated) setCredits(updated.credits);

    } catch (err) {
      setError("Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const promptCards = [
    { title: 'Cinematic Portrait', price: 1 },
    { title: 'Anime Style', price: 1 },
    { title: 'Luxury Product Ad', price: 2 },
    { title: 'Movie Poster', price: 2 },
    { title: 'YouTube Thumbnail', price: 1 },
    { title: 'AI Wallpaper', price: 1 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">

        <div className="max-w-md w-full p-8 rounded-3xl border bg-white dark:bg-zinc-900 shadow-xl">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center">
            <Sparkles className="text-white w-8 h-8" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-center text-gray-900 dark:text-white">
            AI Store
          </h1>

          <p className="mt-3 text-center text-gray-500">
            Login to generate AI images with credits
          </p>

          <button
            onClick={signIn}
            className="mt-8 w-full py-4 rounded-2xl bg-violet-600 text-white font-semibold flex items-center justify-center gap-3"
          >
            <LogIn className="w-5 h-5" />
            Continue with Google
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">

      {/* HEADER */}
      <div className="sticky top-0 z-50 backdrop-blur-xl border-b bg-white/80 dark:bg-black/80">

        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>

            <div>
              <h1 className="font-bold text-lg">AI Store</h1>
              <p className="text-sm text-gray-500">Image generation</p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-500/10 px-4 py-2 rounded-2xl">
              <Coins className="w-4 h-4 text-yellow-600" />
              <span className="font-bold">{credits}</span>
            </div>

            <button className="w-11 h-11 rounded-2xl bg-violet-600 text-white flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </button>

          </div>

        </div>

      </div>

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-6">

        <h2 className="text-4xl md:text-6xl font-bold">
          Generate AI Images Instantly
        </h2>

        <p className="mt-4 text-gray-500">
          Trending prompts + hidden styles + credits system
        </p>

      </div>

      {/* RESULT */}
      {resultImage && (
        <div className="max-w-3xl mx-auto px-4 mb-10">
          <img
            src={resultImage}
            className="rounded-2xl border shadow-lg w-full"
          />
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="max-w-xl mx-auto text-center text-red-500 mb-4">
          {error}
        </div>
      )}

      {/* LOW CREDITS */}
      {credits <= 0 && (
        <div className="text-center text-red-500 mb-6">
          Out of credits — click + to buy more
        </div>
      )}

      {/* CARDS */}
      <div className="max-w-7xl mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {promptCards.map((card, i) => (
          <div
            key={i}
            className="rounded-3xl border bg-white dark:bg-zinc-900 overflow-hidden"
          >

            <div className="h-52 bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500"></div>

            <div className="p-6">

              <h3 className="font-bold text-xl">{card.title}</h3>

              <button
                onClick={() => generateImage(card)}
                disabled={generating || credits <= 0}
                className="mt-5 w-full py-3 rounded-2xl bg-violet-600 text-white font-semibold flex items-center justify-center gap-2"
              >

                {credits <= 0 ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Out of Credits
                  </>
                ) : generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
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
  );
}