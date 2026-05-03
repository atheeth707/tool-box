import React from 'react';
import { Check, Coins, Zap, Star } from 'lucide-react';

export default function Pricing() {
  const tiers = [
    { name: 'Starter', price: '5', credits: 100, icon: <Coins className="text-blue-500" /> },
    { name: 'Pro', price: '15', credits: 500, icon: <Zap className="text-yellow-500" />, popular: true },
    { name: 'Elite', price: '30', credits: 1200, icon: <Star className="text-purple-500" /> }
  ];

  return (
    <div className="max-w-6xl mx-auto py-20 px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">RECHARGE CREDITS</h1>
        <p className="text-gray-500 dark:text-gray-400">Power your workflow with our premium agentic tools.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <div key={tier.name} className={`relative p-8 rounded-3xl border ${tier.popular ? 'border-blue-500 bg-blue-500/5' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f0f0f]'} shadow-xl transition-transform hover:scale-[1.02]`}>
            {tier.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Most Popular</span>
            )}
            <div className="mb-6 p-3 bg-gray-100 dark:bg-white/5 w-fit rounded-2xl">{tier.icon}</div>
            <h3 className="text-xl font-bold dark:text-white mb-1">{tier.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black dark:text-white">${tier.price}</span>
              <span className="text-gray-500 text-sm">/one-time</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Check size={16} className="text-green-500" /> {tier.credits} AI Credits
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Check size={16} className="text-green-500" /> Access to all 150+ tools
              </li>
            </ul>

            <button className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${tier.popular ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20'}`}>
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}