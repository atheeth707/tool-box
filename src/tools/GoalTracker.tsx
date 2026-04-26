import { useState, useEffect } from 'react';
import { TrendingUp, Plus, Trash2 } from 'lucide-react';

export default function GoalTracker() {
  const [goals, setGoals] = useState<{id: string, title: string, current: number, target: number, unit: string}[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target: 100, unit: '%' });

  useEffect(() => {
    const saved = localStorage.getItem('toolbox_goals');
    if (saved) setGoals(JSON.parse(saved));
  }, []);

  const save = (newGoals: any[]) => {
    setGoals(newGoals);
    localStorage.setItem('toolbox_goals', JSON.stringify(newGoals));
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;
    save([...goals, { id: Date.now().toString(), title: newGoal.title, current: 0, target: newGoal.target, unit: newGoal.unit }]);
    setNewGoal({ title: '', target: 100, unit: '%' });
    setShowAdd(false);
  };

  const updateProgress = (id: string, val: number) => {
    save(goals.map(g => g.id === id ? { ...g, current: Math.min(Math.max(0, val), g.target) } : g));
  };

  const remove = (id: string) => save(goals.filter(g => g.id !== id));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-cyan-50 dark:bg-cyan-900/30 p-3 rounded-xl">
              <TrendingUp className="text-cyan-600 dark:text-cyan-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold dark:text-white">Goal Tracker</h2>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold transition-colors shadow-sm">
            <Plus size={18} className="mr-2" /> Add Goal
          </button>
        </div>

        {showAdd && (
          <form onSubmit={add} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Goal Title</label>
              <input type="text" value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} placeholder="Read 10 Books" className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none dark:text-white" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Number</label>
              <input type="number" min="1" value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: Number(e.target.value)})} className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none dark:text-white" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unit</label>
              <div className="flex space-x-2">
                <input type="text" value={newGoal.unit} onChange={e => setNewGoal({...newGoal, unit: e.target.value})} placeholder="Books, $, %" className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none dark:text-white" />
                <button type="submit" className="p-3 bg-cyan-600 text-white rounded-xl font-bold">+</button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-6">
          {goals.length === 0 && !showAdd && (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-400 font-medium">
              No goals set yet. Click "Add Goal" to start tracking.
            </div>
          )}
          
          {goals.map(goal => {
            const percent = Math.round((goal.current / goal.target) * 100);
            return (
              <div key={goal.id} className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 p-6 rounded-2xl relative group">
                <button onClick={() => remove(goal.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18}/></button>
                
                <h3 className="font-bold text-xl dark:text-white mb-4 pr-8">{goal.title}</h3>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-bold text-gray-500">Progress: {percent}%</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{goal.current} / {goal.target} {goal.unit}</div>
                </div>
                
                <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-full h-4 mb-6 overflow-hidden">
                  <div className="bg-cyan-500 h-4 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <input 
                    type="range" min="0" max={goal.target} value={goal.current} 
                    onChange={e => updateProgress(goal.id, Number(e.target.value))}
                    className="flex-1 accent-cyan-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex space-x-2">
                    <button onClick={() => updateProgress(goal.id, goal.current - 1)} className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-600">-</button>
                    <button onClick={() => updateProgress(goal.id, goal.current + 1)} className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-600">+</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
