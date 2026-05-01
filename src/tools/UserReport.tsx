import React, { useState } from 'react';

const UserReport: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    
    const formData = new FormData(e.currentTarget);
    
    // 1. REPLACE 'your_form_id' with the ID from Formspree
    const response = await fetch("https://formspree.io/f/xnjwqlyn", {
      method: "POST",
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto font-sans dark:bg-slate-950 transition-colors">
      <style>
        {`
          :root { --r-bg: #ffffff; --r-in: #f9f9f9; --r-txt: #1a1a1a; --r-brd: #ddd; }
          @media (prefers-color-scheme: dark) {
            :root { --r-bg: #1f2937; --r-in: #111827; --r-txt: #f3f4f6; --r-brd: #374151; }
          }
        `}
      </style>

      <div className="mb-6 text-center">
        <h1 className="text-2xl font-black bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">Report an Issue</h1>
      </div>

      <div style={{ backgroundColor: 'var(--r-bg)', border: '1px solid var(--r-brd)', borderRadius: '16px', padding: '24px' }}>
        {status === 'success' ? (
          <div className="text-center py-8">
            <h2 className="text-lg font-bold" style={{ color: 'var(--r-txt)' }}>Report Received!</h2>
            <p className="text-xs text-gray-500 mt-2">I'll look into this ASAP. Thanks!</p>
            <button onClick={() => setStatus('idle')} className="mt-4 text-blue-500 text-xs font-bold">New Report</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase mb-1 ml-1" style={{ color: 'var(--r-txt)' }}>Broken Tool</label>
              <select name="tool" required className="w-full p-3 rounded-xl border text-sm outline-none" style={{ backgroundColor: 'var(--r-in)', borderColor: 'var(--r-brd)', color: 'var(--r-txt)' }}>
                <option value="Image Gen">Image Generator</option>
                <option value="Video Gen">Video Generator</option>
                <option value="BG Remover">Background Remover</option>
                <option value="AI Chat">AI Chat Bot</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase mb-1 ml-1" style={{ color: 'var(--r-txt)' }}>What's wrong?</label>
              <textarea name="message" required className="w-full p-3 rounded-xl border text-sm outline-none" style={{ backgroundColor: 'var(--r-in)', borderColor: 'var(--r-brd)', color: 'var(--r-txt)' }} rows={4} />
            </div>
            <button type="submit" disabled={status === 'sending'} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-900/20">
              {status === 'sending' ? "Sending..." : "Submit Report"}
            </button>
            {status === 'error' && <p className="text-center text-red-500 text-[10px] mt-2">Something went wrong. Try again later.</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default UserReport;