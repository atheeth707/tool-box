import { useState, useEffect } from 'react';
import { ListTodo, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

export default function TodoList() {
  const [todos, setTodos] = useState<{id: string, text: string, done: boolean}[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('toolbox_todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  const save = (newTodos: any[]) => {
    setTodos(newTodos);
    localStorage.setItem('toolbox_todos', JSON.stringify(newTodos));
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    save([{ id: Date.now().toString(), text: input.trim(), done: false }, ...todos]);
    setInput('');
  };

  const toggle = (id: string) => {
    save(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const remove = (id: string) => {
    save(todos.filter(t => t.id !== id));
  };

  const clearDone = () => {
    save(todos.filter(t => !t.done));
  };

  const doneCount = todos.filter(t => t.done).length;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-xl">
              <ListTodo className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold dark:text-white">To-Do List</h2>
          </div>
          <div className="text-sm font-bold text-gray-500 bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-lg">
            {doneCount} / {todos.length} Done
          </div>
        </div>

        <form onSubmit={add} className="relative mb-8">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full p-5 pr-16 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-green-500 outline-none text-lg font-medium"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-sm transition-transform hover:scale-105 active:scale-95">
            <Plus size={20} />
          </button>
        </form>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {todos.length === 0 ? (
            <div className="text-center py-10 text-gray-400 font-medium border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
              You're all caught up! Add a task above.
            </div>
          ) : (
            todos.map(todo => (
              <div key={todo.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${todo.done ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-60' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm'}`}>
                <div className="flex items-center space-x-4 flex-1 cursor-pointer" onClick={() => toggle(todo.id)}>
                  <button className={`shrink-0 ${todo.done ? 'text-green-500' : 'text-gray-300 dark:text-gray-600 hover:text-green-400'}`}>
                    {todo.done ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  <span className={`font-medium text-lg truncate ${todo.done ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                    {todo.text}
                  </span>
                </div>
                <button onClick={() => remove(todo.id)} className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {doneCount > 0 && (
          <div className="mt-6 flex justify-end">
            <button onClick={clearDone} className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors">
              Clear Completed Tasks
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
