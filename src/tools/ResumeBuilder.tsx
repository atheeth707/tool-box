import { useState } from 'react';
import { FileBadge, Download, Plus, Trash2 } from 'lucide-react';

export default function ResumeBuilder() {
  const [data, setData] = useState({
    name: 'John Doe',
    title: 'Software Engineer',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    summary: 'Passionate and results-driven engineer with 5+ years of experience building scalable web applications.',
    experience: [{ company: 'Tech Corp', role: 'Senior Developer', dates: '2020 - Present', desc: 'Led a team of 5 developers to build a new SaaS product.' }],
    education: [{ school: 'University of Technology', degree: 'B.S. Computer Science', dates: '2016 - 2020' }],
    skills: 'JavaScript, React, Node.js, TypeScript, SQL'
  });

  const handleDownload = () => window.print();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 print:shadow-none print:border-none print:p-0">
        
        <div className="flex justify-between items-center mb-8 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-xl">
              <FileBadge className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold dark:text-white">Resume Builder</h2>
          </div>
          <button onClick={handleDownload} className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-sm">
            <Download size={18} className="mr-2" /> Save PDF
          </button>
        </div>

        {/* Resume Body */}
        <div className="p-8 border border-gray-200 dark:border-gray-700 rounded-2xl print:border-none print:p-0 font-sans">
          
          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-gray-200 pb-8">
            <input type="text" value={data.name} onChange={e => setData({...data, name: e.target.value})} className="text-4xl font-black bg-transparent outline-none dark:text-white text-center w-full mb-2" />
            <input type="text" value={data.title} onChange={e => setData({...data, title: e.target.value})} className="text-xl text-gray-500 bg-transparent outline-none text-center w-full font-medium mb-4" />
            <div className="flex justify-center space-x-4 text-sm font-bold text-gray-500">
              <input type="text" value={data.email} onChange={e => setData({...data, email: e.target.value})} className="bg-transparent outline-none text-center w-48" />
              <span>•</span>
              <input type="text" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} className="bg-transparent outline-none text-center w-32" />
            </div>
          </div>

          {/* Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-black uppercase tracking-widest text-indigo-600 mb-3">Professional Summary</h3>
            <textarea value={data.summary} onChange={e => setData({...data, summary: e.target.value})} className="w-full bg-transparent outline-none dark:text-white resize-none h-20 leading-relaxed" />
          </div>

          {/* Experience */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black uppercase tracking-widest text-indigo-600">Experience</h3>
              <button onClick={() => setData({...data, experience: [...data.experience, {company: 'New Company', role: 'Role', dates: 'Year - Year', desc: 'Description'}]})} className="text-xs font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded print:hidden">+ Add</button>
            </div>
            <div className="space-y-6">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="relative group">
                  <div className="flex justify-between font-bold text-gray-900 dark:text-white mb-1">
                    <div className="flex space-x-2">
                      <input type="text" value={exp.role} onChange={e => {const n=[...data.experience]; n[idx].role=e.target.value; setData({...data, experience: n})}} className="bg-transparent outline-none w-48" />
                      <span className="text-gray-400">at</span>
                      <input type="text" value={exp.company} onChange={e => {const n=[...data.experience]; n[idx].company=e.target.value; setData({...data, experience: n})}} className="bg-transparent outline-none text-indigo-600 w-48" />
                    </div>
                    <input type="text" value={exp.dates} onChange={e => {const n=[...data.experience]; n[idx].dates=e.target.value; setData({...data, experience: n})}} className="bg-transparent outline-none text-right text-gray-500 w-32" />
                  </div>
                  <textarea value={exp.desc} onChange={e => {const n=[...data.experience]; n[idx].desc=e.target.value; setData({...data, experience: n})}} className="w-full bg-transparent outline-none text-gray-600 dark:text-gray-400 resize-none h-16" />
                  <button onClick={() => setData({...data, experience: data.experience.filter((_, i) => i !== idx)})} className="absolute -left-8 top-1 text-red-400 opacity-0 group-hover:opacity-100 print:hidden"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black uppercase tracking-widest text-indigo-600">Education</h3>
              <button onClick={() => setData({...data, education: [...data.education, {school: 'School', degree: 'Degree', dates: 'Year - Year'}]})} className="text-xs font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded print:hidden">+ Add</button>
            </div>
            <div className="space-y-4">
              {data.education.map((edu, idx) => (
                <div key={idx} className="relative group flex justify-between">
                  <div>
                    <input type="text" value={edu.degree} onChange={e => {const n=[...data.education]; n[idx].degree=e.target.value; setData({...data, education: n})}} className="font-bold text-gray-900 dark:text-white bg-transparent outline-none w-64 block" />
                    <input type="text" value={edu.school} onChange={e => {const n=[...data.education]; n[idx].school=e.target.value; setData({...data, education: n})}} className="text-gray-600 dark:text-gray-400 bg-transparent outline-none w-64 block" />
                  </div>
                  <input type="text" value={edu.dates} onChange={e => {const n=[...data.education]; n[idx].dates=e.target.value; setData({...data, education: n})}} className="font-bold text-gray-500 bg-transparent outline-none text-right w-32" />
                  <button onClick={() => setData({...data, education: data.education.filter((_, i) => i !== idx)})} className="absolute -left-8 top-1 text-red-400 opacity-0 group-hover:opacity-100 print:hidden"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest text-indigo-600 mb-3">Skills</h3>
            <input type="text" value={data.skills} onChange={e => setData({...data, skills: e.target.value})} className="w-full bg-transparent outline-none font-bold text-gray-800 dark:text-gray-200" />
          </div>

        </div>
      </div>
      
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:hidden { display: none !important; }
          .max-w-4xl { max-width: none !important; margin: 0 !important; }
          .bg-white { background-color: white !important; }
          .dark\\:text-white, .dark\\:text-gray-200, .dark\\:text-gray-400 { color: black !important; }
          .dark\\:bg-gray-800 { background-color: white !important; }
          .dark\\:border-gray-700 { border-color: #e5e7eb !important; }
          .bg-white > .p-8 { visibility: visible; position: absolute; left: 0; top: 0; width: 100%; }
          .bg-white > .p-8 * { visibility: visible; }
          input, textarea { border: none !important; }
        }
      `}</style>
    </div>
  );
}
