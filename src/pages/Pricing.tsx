import React from 'react';
import { Check, Coins, Zap } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Top Up Your Credits</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Pay as you go. No subscriptions. No hidden fees.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Tier 1 */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Starter Kit</h3>
          <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">$5</div>
          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Coins className="text-yellow-500 w-5 h-5" /> 100 AI Credits
            </li>
            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Check className="text-green-500 w-5 h-5" /> Access to all 160+ tools
            </li>
          </ul>
          <button className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white py-3 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            Buy Now
          </button>
        </div>

        {/* Tier 2 - Popular */}
        <div className="bg-gradient-to-b from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-xl transform md:-translate-y-4 flex flex-col relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
            <Zap size={14} /> MOST POPULAR
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Pro Builder</h3>
          <div className="text-4xl font-extrabold text-white mb-6">$15</div>
          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-center gap-3 text-blue-100">
              <Coins className="text-yellow-400 w-5 h-5" /> 500 AI Credits
            </li>
            <li className="flex items-center gap-3 text-blue-100">
              <Check className="text-green-400 w-5 h-5" /> Access to all 160+ tools
            </li>
            <li className="flex items-center gap-3 text-blue-100">
              <Check className="text-green-400 w-5 h-5" /> Priority AI Routing
            </li>
          </ul>
          <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition shadow-md">
            Buy Now
          </button>
        </div>

        {/* Tier 3 */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Power User</h3>
          <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">$30</div>
          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Coins className="text-yellow-500 w-5 h-5" /> 1200 AI Credits
            </li>
            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Check className="text-green-500 w-5 h-5" /> Access to all 160+ tools
            </li>
          </ul>
          <button className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white py-3 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}