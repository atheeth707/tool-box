import { useState, useEffect } from 'react';
import { StickyNote, Plus, Trash2, Edit3 } from 'lucide-react';

export default function NotesApp() {
  const [notes, setNotes] = useState<{id: string, title: string, content: string, date: string}[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('toolbox_notes');
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  const save = (newNotes: any[]) => {
    setNotes(newNotes);
    localStorage.setItem('toolbox_notes', JSON.stringify(newNotes));
  };

  const addNote = () => {
    const newNote = { id: Date.now().toString(), title: 'Untitled Note', content: '', date: new Date().toLocaleDateString() };
    save([newNote, ...notes]);
    setActiveId(newNote.id);
  };

  const deleteNote = (id: string, e: any) => {
    e.stopPropagation();
    const newNotes = notes.filter(n => n.id !== id);
    save(newNotes);
    if (activeId === id) setActiveId(null);
  };

  const updateNote = (field: 'title' | 'content', value: string) => {
    if (!activeId) return;
    const newNotes = notes.map(n => n.id === activeId ? { ...n, [field]: value } : n);
    save(newNotes);
  };

  const activeNote = notes.find(n => n.id === activeId);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px]">
      {/* Sidebar */}
      <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-yellow-50 dark:bg-yellow-900/10">
          <div className="flex items-center font-bold text-yellow-700 dark:text-yellow-500">
            <StickyNote className="mr-2" size={20} /> My Notes
          </div>
          <button onClick={addNote} className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-sm transition-colors">
            <Plus size={16} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {notes.length === 0 ? (
            <div className="text-center text-gray-400 py-10 font-medium">No notes yet. Click + to create one.</div>
          ) : (
            notes.map(note => (
              <div 
                key={note.id} 
                onClick={() => setActiveId(note.id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${activeId === note.id ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800' : 'bg-gray-50 dark:bg-gray-900 border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-gray-900 dark:text-white truncate pr-4">{note.title}</div>
                  <button onClick={(e) => deleteNote(note.id, e)} className="text-gray-400 hover:text-red-500 shrink-0"><Trash2 size={14}/></button>
                </div>
                <div className="text-xs text-gray-500 truncate">{note.content || 'Empty note...'}</div>
                <div className="text-[10px] text-gray-400 mt-2 font-bold uppercase">{note.date}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col p-8">
        {activeNote ? (
          <>
            <input 
              type="text" 
              value={activeNote.title} 
              onChange={e => updateNote('title', e.target.value)}
              className="text-3xl font-black bg-transparent outline-none dark:text-white mb-6 border-b border-transparent focus:border-gray-200 dark:focus:border-gray-700 pb-2 transition-colors"
              placeholder="Note Title"
            />
            <textarea 
              value={activeNote.content}
              onChange={e => updateNote('content', e.target.value)}
              className="flex-1 w-full bg-transparent outline-none dark:text-gray-300 text-lg leading-relaxed resize-none"
              placeholder="Start typing your note here..."
            />
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 font-bold flex justify-between">
              <span>Auto-saved to local storage</span>
              <span>{activeNote.content.length} characters</span>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <Edit3 size={48} className="mb-4 opacity-50" />
            <p className="font-medium text-lg">Select a note to edit or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}
