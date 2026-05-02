import React, { useState } from 'react';
import { Book, Download, ExternalLink, Search, BookOpen, GraduationCap } from 'lucide-react';

// Simplified data structure based on the TN Textbooks source
const BOOK_DATA = [
  { id: 1, title: 'Mathematics (Vol 1)', medium: 'English', category: 'Core', color: 'bg-blue-500' },
  { id: 2, title: 'Mathematics (Vol 2)', medium: 'English', category: 'Core', color: 'bg-blue-600' },
  { id: 3, title: 'Physics (Vol 1)', medium: 'English', category: 'Science', color: 'bg-purple-500' },
  { id: 4, title: 'Physics (Vol 2)', medium: 'English', category: 'Science', color: 'bg-purple-600' },
  { id: 5, title: 'Chemistry (Vol 1)', medium: 'English', category: 'Science', color: 'bg-emerald-500' },
  { id: 6, title: 'Chemistry (Vol 2)', medium: 'English', category: 'Science', color: 'bg-emerald-600' },
  { id: 7, title: 'Biology', medium: 'English', category: 'Science', color: 'bg-green-500' },
  { id: 8, title: 'Computer Science', medium: 'English', category: 'Tech', color: 'bg-slate-700' },
  { id: 9, title: 'Economics', medium: 'English', category: 'Arts', color: 'bg-amber-600' },
  { id: 10, title: 'Commerce', medium: 'English', category: 'Arts', color: 'bg-orange-500' },
  { id: 11, title: 'Accountancy (Vol 1)', medium: 'English', category: 'Arts', color: 'bg-rose-500' },
  { id: 12, title: 'Tamil', medium: 'Tamil', category: 'Language', color: 'bg-red-600' },
  { id: 13, title: 'English', medium: 'English', category: 'Language', color: 'bg-indigo-500' },
];

const TextbookLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(BOOK_DATA.map(book => book.category))];

  const filteredBooks = BOOK_DATA.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || book.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      {/* Header Section */}
      <header className="max-w-7xl mx-auto mb-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
            <GraduationCap className="text-white w-8 h-8" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">TN 12th Standard Library</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Access all Samacheer Kalvi textbooks for the 2025-2026 academic year. 
          High-quality PDF downloads for Tamil and English medium.
        </p>
      </header>

      {/* Controls Section */}
      <div className="max-w-7xl mx-auto mb-10 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for subjects..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filter === cat 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div 
            key={book.id} 
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Book "Cover" Visual */}
            <div className={`${book.color} h-32 flex items-center justify-center relative overflow-hidden`}>
              <BookOpen className="text-white/20 w-24 h-24 absolute -right-4 -bottom-4 rotate-12" />
              <Book className="text-white w-12 h-12 relative z-10" />
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-gray-100 text-gray-500">
                  {book.category}
                </span>
                <span className="text-xs font-semibold text-blue-600">
                  {book.medium}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 mb-4 line-clamp-1">
                {book.title}
              </h3>

              <div className="flex gap-2">
                <button className="flex-1 bg-gray-900 text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
                  <Download className="w-4 h-4" />
                  PDF
                </button>
                <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <ExternalLink className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Empty State */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No books found matching your search.</p>
        </div>
      )}

      {/* Footer Info */}
      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm">
        <p>© 2026 Tamilnadu Samacheer Kalvi Digital Library</p>
        <p className="mt-1">All textbooks are provided for educational purposes[cite: 3].</p>
      </footer>
    </div>
  );
};

export default TextbookLibrary;