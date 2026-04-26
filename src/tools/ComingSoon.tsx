import { Construction } from 'lucide-react';

export default function ComingSoon() {
  return (
    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm max-w-2xl mx-auto">
      <div className="w-24 h-24 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Construction className="w-12 h-12 text-amber-500" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Tool in Development</h2>
      <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto">We're working hard to bring this tool to you. Please check back later!</p>
    </div>
  );
}
