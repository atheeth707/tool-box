import { useState, useEffect } from 'react';
import { Target, Plus, Trash2 } from 'lucide-react';

export default function HabitTracker() {
  const [habits, setHabits] = useState<{id: string, name: string, days: boolean[]}[]>([]);
  const [input, setInput] = useState('');

  // 7 days history
  const days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { name: d.toLocaleDateString('en-US', { weekday: 'short' }), date: d.getDate() };
  });

  useEffect(() => {
    const saved = localStorage.getItem('toolbox_habits');
    if (saved) setHabits(JSON.parse(saved));
  }, []);

  const save = (newHabits: any[]) => {
    setHabits(newHabits);
    localStorage.setItem('toolbox_habits', JSON.stringify(newHabits));
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    save([...habits, { id: Date.now().toString(), name: input.trim(), days: Array(7).fill(false) }]);
    setInput('');
  };

  const toggle = (habitId: string, dayIndex: number) => {
    save(habits.map(h => {
      if (h.id === habitId) {
        const newDays = [...h.days];
        newDays[dayIndex] = !newDays[dayIndex];
        return { ...h, days: newDays };
      }
      return h;
    }));
  };

  const remove = (id: string) => save(habits.filter(h => h.id !== id));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded-xl">
            <Target className="text-orange-600 dark:text-orange-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">7-Day Habit Tracker</h2>
        </div>

        <form onSubmit={add} className="relative mb-10">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new habit (e.g. Drink Water, Read 10 pages)..."
            className="w-full p-4 pr-16 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-orange-500 outline-none text-lg font-medium"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-sm transition-transform hover:scale-105 active:scale-95">
            <Plus size={20} />
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left pb-4 text-gray-500 font-bold">Habit</th>
                {days.map((d, i) => (
                  <th key={i} className="pb-4 text-center">
                    <div className="text-xs text-gray-400 uppercase">{d.name}</div>
                    <div className={`text-sm font-black ${i === 6 ? 'text-orange-500' : 'text-gray-700 dark:text-gray-300'}`}>{d.date}</div>
                  </th>
                ))}
                <th className="pb-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {habits.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400 font-medium">No habits tracked yet.</td>
                </tr>
              ) : (
                habits.map(h => (
                  <tr key={h.id} className="group">
                    <td className="py-4 font-bold text-gray-900 dark:text-white">{h.name}</td>
                    {h.days.map((done, i) => (
                      <td key={i} className="py-4 text-center">
                        <button 
                          onClick={() => toggle(h.id, i)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all mx-auto ${done ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                        >
                          {done && <span className="text-sm font-black">✓</span>}
                        </button>
                      </td>
                    ))}
                    <td className="py-4 text-right">
                      <button onClick={() => remove(h.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
