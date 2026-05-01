import React, { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, Copy, Sparkles, Check } from 'lucide-react';

const DATA = {
  protagonists: [
    'A weary cybernetic detective with a glitching memory',
    'An ambitious alchemist seeking the elixir of silence',
    'A rogue AI inhabiting a discarded toaster',
    'A disgraced starship captain living in the slums',
    'A time-traveling historian who accidentally broke the Renaissance',
    'A professional dream-weaver lost in a client’s nightmare',
    'A sentient cloud of interstellar dust seeking a physical form',
    'A master thief who only steals memories',
    'The last librarian of a sunken underwater city',
    'A nomadic gardener planting forests on desolate moons'
  ],
  incitingIncidents: [
    'unexpectedly deciphered a signal from a dead civilization',
    'uncovered a plot to rewrite the laws of physics',
    'discovered an ancient artifact that hummed with forbidden energy',
    'found a door in the middle of the desert that shouldn’t exist',
    'received a letter from their future self warning of a collapse',
    'witnessed a glitch in the horizon that revealed the digital sky',
    'stumbled upon a secret meeting of shadows in a jazz club',
    'acquired a map that traced the path of a lost constellation',
    'was tasked with transporting a flickering soul to the afterlife',
    'broke into a vault only to find it filled with their own childhood toys'
  ],
  complications: [
    'while being hunted by an organization that doesn’t officially exist.',
    'realizing that every choice they made was being broadcast to the galaxy.',
    'only to find that time was moving backwards every time they blinked.',
    'despite the fact that they were slowly turning into crystal.',
    'under the watchful, unblinking eyes of the city’s surveillance gargoyles.',
    'even though the oxygen scrubbers were failing on the colony ship.',
    'as the gravity of the planet began to fluctuate unpredictably.',
    'knowing that their actions would ripple across every parallel universe.',
    'while a persistent ghost whispered conflicting advice in their ear.',
    'as the edges of reality began to fray and leak pure static.'
  ],
  resolutions: [
    'Ultimately, they chose to embrace the chaos rather than fix it.',
    'The truth they found was more terrifying than the lie they lived.',
    'In the end, the only way forward was to delete their own history.',
    'They realized the villain was simply a version of them that succeeded.',
    'A single spark of hope remained, though the world around them fell silent.',
    'The outcome was a paradoxical loop they were destined to repeat forever.',
    'They walked away, leaving the legendary power for someone else to find.',
    'The universe shifted, and for the first time, the silence felt like home.',
    'They traded their immortality for one perfect, fleeting afternoon.',
    'The mission failed, but they finally understood the value of the journey.'
  ]
};

export default function RandomStoryGenerator() {
  const [story, setStory] = useState({ title: '', body: '' });
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const p = DATA.protagonists[Math.floor(Math.random() * DATA.protagonists.length)];
    const i = DATA.incitingIncidents[Math.floor(Math.random() * DATA.incitingIncidents.length)];
    const c = DATA.complications[Math.floor(Math.random() * DATA.complications.length)];
    const r = DATA.resolutions[Math.floor(Math.random() * DATA.resolutions.length)];

    setStory({
      title: `${p.split(' ').slice(0, 3).join(' ')}'s Paradox`,
      body: `${p} ${i} ${c} ${r}`
    });
  };

  // Correct way to initialize on mount
  useEffect(() => {
    generate();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${story.title}\n${story.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8 font-serif">
      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="p-8 pb-4 text-center border-b border-slate-50 dark:border-slate-800">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
            <BookOpen className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Narrative Engine</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Infinite Literary Prompts</p>
        </div>

        {/* Story Area */}
        <div className="p-8 sm:p-12">
          <div className="relative group bg-slate-50 dark:bg-black/40 p-8 sm:p-10 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800 transition-all hover:border-amber-400/50">
            
            <div className="flex items-center gap-2 mb-4 text-amber-500">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">{story.title}</span>
            </div>

            <p className="text-xl sm:text-2xl text-slate-800 dark:text-slate-200 leading-relaxed italic font-medium">
              "{story.body}"
            </p>

            <button 
              onClick={copyToClipboard} 
              className="absolute top-4 right-4 p-3 bg-white dark:bg-slate-800 shadow-md rounded-xl text-slate-500 hover:text-amber-500 transition-all active:scale-90"
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
          </div>

          {/* Controls */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <button 
              onClick={generate} 
              className="group px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 flex items-center shadow-xl"
            >
              <RefreshCw size={22} className="mr-3 group-active:rotate-180 transition-transform duration-500" /> 
              Forge New Reality
            </button>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Over 10,000 Unique Narrative Permutations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}