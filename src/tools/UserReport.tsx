import React, { useState } from 'react';

const UserReport: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tool = formData.get('tool');
    const issue = formData.get('issue');
    
    // This opens the user's email app with the details filled in
    // Replace 'your-email@example.com' with your actual email
    const mailtoLink = `mailto:atheeth707@gmail.com?subject=Tool Issue Report: ${tool}&body=Tool: ${tool}%0D%0AIssue: ${issue}`;
    window.location.href = mailtoLink;
    
    setStatus('success');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto font-sans dark:bg-slate-950 transition-colors">
      <style>
        {`
          :root {
            --report-bg: #ffffff;
            --report-input: #f9f9f9;
            --report-text: #1a1a1a;
            --report-border: #ddd;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --report-bg: #1f2937;
              --report-input: #111827;
              --report-text: #f3f4f6;
              --report-border: #374151;
            }
          }
        `}
      </style>

      <div className="mb-6 text-center">
        <h1 className="text-2xl font-black bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
          Report an Issue
        </h1>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">
          Help us fix broken AI tools
        </p>
      </div>

      <div style={{ 
        backgroundColor: 'var(--report-bg)',
        border: '1px solid var(--report-border)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--report-text)' }}>Report Prepared!</h2>
            <p className="text-xs text-gray-500 mt-2">Your email app should open now. Hit send to let us know!</p>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-6 text-xs font-bold text-blue-500 hover:underline"
            >
              Send another report
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase mb-1 ml-1" style={{ color: 'var(--report-text)' }}>
                Select Broken Tool
              </label>
              <select 
                name="tool"
                required
                className="w-full p-3 rounded-xl border text-sm outline-none transition-all"
                style={{ 
                  backgroundColor: 'var(--report-input)',
                  borderColor: 'var(--report-border)',
                  color: 'var(--report-text)'
                }}
              >
                <option value="Image Generator">Image Generator</option>
                <option value="Video Generator">Video Generator</option>
                <option value="Background Remover">Background Remover</option>
                <option value="AI Chat Bot">AI Chat Bot</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase mb-1 ml-1" style={{ color: 'var(--report-text)' }}>
                Describe the Issue
              </label>
              <textarea 
                name="issue"
                required
                placeholder="e.g. The frame is blank, or the generate button doesn't click..."
                rows={4}
                className="w-full p-3 rounded-xl border text-sm outline-none transition-all"
                style={{ 
                  backgroundColor: 'var(--report-input)',
                  borderColor: 'var(--report-border)',
                  color: 'var(--report-text)'
                }}
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-red-900/20"
            >
              Send Report
            </button>
          </form>
        )}
      </div>

      <p className="mt-4 text-[9px] text-center text-gray-400">
        Reports are sent via your local email client to ensure privacy.[cite: 20]
      </p>
    </div>
  );
};

export default UserReport;