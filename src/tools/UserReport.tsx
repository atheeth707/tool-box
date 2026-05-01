import React, { useState, useEffect } from 'react';

const UserReport: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'locked'>('idle');
  const [timeLeft, setTimeLeft] = useState<string>("");

  // Check if the user has already sent a message in the last 24 hours
  useEffect(() => {
    const lastSent = localStorage.getItem('last_report_sent');
    if (lastSent) {
      const lastSentDate = new Date(parseInt(lastSent));
      const now = new Date();
      const hoursSince = (now.getTime() - lastSentDate.getTime()) / (1000 * 60 * 60);

      if (hoursSince < 24) {
        setStatus('locked');
        const hoursRemaining = Math.ceil(24 - hoursSince);
        setTimeLeft(`${hoursRemaining} hours`);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    
    const formData = new FormData(e.currentTarget);
    
    // REPLACE 'your_form_id' with your actual Formspree ID
    const response = await fetch("https://formspree.io/f/xnjwqlyn", {
      method: "POST",
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      // Save the current timestamp to block the user for 24 hours
      localStorage.setItem('last_report_sent', Date.now().toString());
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
        <h1 className="text-2xl font-black bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
          Report an Issue
        </h1>
      </div>

      <div style={{ 
        backgroundColor: 'var(--r-bg)', 
        border: '1px solid var(--r-brd)', 
        borderRadius: '16px', 
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
      }}>
        {status === 'locked' ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-3">⏳</div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--r-txt)' }}>Limit Reached</h2>
            <p className="text-xs text-gray-500 mt-2">
              You can only send one report every 24 hours. 
              Please try again in about <b>{timeLeft}</b>.
            </p>
          </div>
        ) : status === 'success' ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-3">✅</div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--r-txt)' }}>Message Sent!</h2>
            <p className="text-xs text-gray-500 mt-2">Thanks! I'll look into it. You can send another report tomorrow.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="Subject" value="General Tool Report" />
            <div>
              <label className="block text-[10px] font-bold uppercase mb-2 ml-1" style={{ color: 'var(--r-txt)' }}>
                Your Message
              </label>
              <textarea 
                name="message" 
                required 
                placeholder="Tell me what's not working..." 
                className="w-full p-4 rounded-xl border text-sm outline-none transition-all" 
                style={{ 
                  backgroundColor: 'var(--r-in)', 
                  borderColor: 'var(--r-brd)', 
                  color: 'var(--r-txt)',
                  minHeight: '150px'
                }} 
              />
            </div>

            <button 
              type="submit" 
              disabled={status === 'sending'} 
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-900/20"
            >
              {status === 'sending' ? "Sending..." : "Submit Report"}
            </button>

            {status === 'error' && (
              <p className="text-center text-red-500 text-[10px] mt-2 font-bold">
                Failed to send. Please check your internet.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default UserReport;