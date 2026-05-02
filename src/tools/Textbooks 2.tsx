import React, { useState } from 'react';

// --- Types ---
interface BookLinks {
  pdf: string | null;
  epub: string | null;
  html: string | null;
}

interface SubjectEntry {
  name: string;
  english: BookLinks;
  tamil: BookLinks;
}

/**
 * 10th Standard Textbook Directory
 * Merged English Medium and Tamil Medium links into a unified TypeScript component.
 */
const textbookData10th: SubjectEntry[] = [
  {
    name: "Tamil",
    english: { 
      pdf: "126HDzwgKz1gNaSXWJSow2upisHXVe57-", 
      epub: "166I0ZnRqlMpbwlCg7JuOduRHuZfRrQBQ", 
      html: "https://d1wpyxz35bzzz4.cloudfront.net/tnschools/10-Tamil-TM/10-Tamil-TM.html" 
    },
    tamil: { 
      pdf: "126HDzwgKz1gNaSXWJSow2upisHXVe57-", 
      epub: "166I0ZnRqlMpbwlCg7JuOduRHuZfRrQBQ", 
      html: "https://d1wpyxz35bzzz4.cloudfront.net/tnschools/10-Tamil-TM/10-Tamil-TM.html" 
    }
  },
  {
    name: "English",
    english: { 
      pdf: "1IM8pIb30Td-Od7Xb5kV-kPLns9_TxvQ3", 
      epub: "1NRWInONsU2DmLE3myu2Bs2Kg4J1f_1V9", 
      html: "https://d1wpyxz35bzzz4.cloudfront.net/tnschools/10-eng-n/10-eng-n.html" 
    },
    tamil: { 
      pdf: "1IM8pIb30Td-Od7Xb5kV-kPLns9_TxvQ3", 
      epub: "1NRWInONsU2DmLE3myu2Bs2Kg4J1f_1V9", 
      html: "https://d1wpyxz35bzzz4.cloudfront.net/tnschools/10-eng-n/10-eng-n.html" 
    }
  },
  {
    name: "Mathematics",
    english: { 
      pdf: "13XJXdPhuGqU3BG3BPrsmzZwUUFOuH6Of", 
      epub: "1pVt9sjhN7Mqzp5OQqjDMjJQjzW-_pTWN", 
      html: "https://d1wpyxz35bzzz4.cloudfront.net/tnschools/10-MATHS-EM/10-MATHS-EM.html" 
    },
    tamil: { 
      pdf: "1BLAJHjMzbBuYesS2qL6NDEl7Tf3xmNBC", 
      epub: "1T0wACCr_chKa5V6Eu52_2q2afEfIZBuz", 
      html: "https://d1wpyxz35bzzz4.cloudfront.net/tnschools/10mathsTM/10mathsTM.html" 
    }
  },
  {
    name: "Science",
    english: { 
      pdf: "1n9pMjxmIWqE5llQpHDdh-vFu8Gemsw1k", 
      epub: "1TiifQCCLSeh8mRIwMwp08TNM1hI7MkPs", 
      html: "https://d1wpyxz35bzzz4.cloudfront.net/tnschools/10-Science-EM/10-Science-EM.html" 
    },
    tamil: { 
      pdf: "16mbZtP_8H902it-bbWOAzOZ58bPpgqFL", 
      epub: "18E_MOFBjLIUYi0Cc2Ui2JbScDbVf-IT1", 
      html: "https://d1wpyxz35bzzz4.cloudfront.net/tnschools/10-Science-TM/10-Science-TM.html" 
    }
  },
  {
    name: "Social Science",
    english: { 
      pdf: "1neVsjraP49u5rtfQBAzMcojHTtoMhqtb", 
      epub: "19ZkEY1bE7HeJYlZChwAuH2iwpMl73ca9", 
      html: "https://d1wpyxz35bzzz4.cloudfront.net/tnschools/10-SOCIALSCIENCE-EM/10-SOCIALSCIENCE-EM.html" 
    },
    tamil: { 
      pdf: "1gT8-P5oMKwVw3rcMN0JdWhW9iei00qKs", 
      epub: "1vQfcYT1h2LQP_wb1U62oiq2A7oVoSXOE", 
      html: "https://d1wpyxz35bzzz4.cloudfront.net/tnschools/10-SOCIALSCIENCE-TM/10-SOCIALSCIENCE-TM.html" 
    }
  },
  {
    name: "Physical Education",
    english: { pdf: "1G5y4qNc3MFOL_pMmRffWnlTkQKmNCRGv", epub: null, html: null },
    tamil: { pdf: "1y9MF6Vr5TdQZMWLfwqDVVrZjO8pnUtpv", epub: null, html: null }
  }
];

// --- Sub-Components ---
const ActionLink = ({ id, url, label }: { id?: string | null; url?: string | null; label: string }) => {
  const isAvailable = id || url;
  if (!isAvailable) return <span className="text-slate-300 italic text-[10px]">N/A</span>;

  const finalUrl = url ? url : `https://drive.google.com/file/d/${id}/view?usp=drivesdk`;
  
  const styles: Record<string, string> = {
    PDF: "text-rose-600 bg-rose-50 border-rose-200 hover:bg-rose-600 hover:text-white",
    EPUB: "text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-600 hover:text-white",
    HTML: "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-600 hover:text-white"
  };

  return (
    <a
      href={finalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`px-2 py-1 text-[9px] font-bold rounded border transition-all uppercase tracking-tighter ${styles[label]}`}
    >
      {label}
    </a>
  );
};

export default function TenthBooksDirectory() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = textbookData10th.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto my-10 p-4 font-sans text-slate-800">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-8 bg-slate-900 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight">10th Standard Textbooks</h1>
              <p className="text-slate-400 mt-1">Multi-format Resources (PDF, EPUB, HTML)</p>
            </div>
            <input
              type="text"
              placeholder="Search subject..."
              className="w-full md:w-72 px-5 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-5 font-bold text-slate-500 uppercase text-xs tracking-widest">Subject</th>
                <th className="px-6 py-5 font-bold text-center text-indigo-600 uppercase text-xs tracking-widest bg-indigo-50/30 border-x border-white">English Medium</th>
                <th className="px-6 py-5 font-bold text-center text-rose-600 uppercase text-xs tracking-widest bg-rose-50/30 border-x border-white">Tamil Medium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((book, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-5 font-bold text-slate-700">{book.name}</td>
                  
                  {/* English Links */}
                  <td className="px-6 py-5 bg-indigo-50/10">
                    <div className="flex justify-center gap-2">
                      <ActionLink id={book.english.pdf} label="PDF" />
                      <ActionLink id={book.english.epub} label="EPUB" />
                      <ActionLink url={book.english.html} label="HTML" />
                    </div>
                  </td>

                  {/* Tamil Links */}
                  <td className="px-6 py-5 bg-rose-50/10">
                    <div className="flex justify-center gap-2">
                      <ActionLink id={book.tamil.pdf} label="PDF" />
                      <ActionLink id={book.tamil.epub} label="EPUB" />
                      <ActionLink url={book.tamil.html} label="HTML" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-[11px] uppercase tracking-widest font-bold">
            Data Merged Successfully • React TSX Component
          </p>
        </div>
      </div>
    </div>
  );
}