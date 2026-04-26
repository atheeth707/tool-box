import React, { useState, useEffect } from 'react';

const ReactionTest = () => {
  const [status, setStatus] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [startTime, setStartTime] = useState(0);
  const [score, setScore] = useState<number | null>(null);

  const startTest = () => {
    setStatus('waiting');
    const delay = Math.floor(Math.random() * 3000) + 2000;
    setTimeout(() => {
      setStartTime(Date.now());
      setStatus('ready');
    }, delay);
  };

  const handleClick = () => {
    if (status === 'waiting') {
      setStatus('idle');
      alert('Too soon!');
    } else if (status === 'ready') {
      const reactionTime = Date.now() - startTime;
      setScore(reactionTime);
      setStatus('result');
    }
  };

  return (
    <div 
      onClick={status === 'ready' || status === 'waiting' ? handleClick : undefined}
      className={`h-64 w-full flex flex-col items-center justify-center rounded-xl cursor-pointer transition-colors duration-200 ${
        status === 'waiting' ? 'bg-red-500' : status === 'ready' ? 'bg-green-500' : 'bg-blue-600'
      }`}
    >
      {status === 'idle' && <button onClick={startTest} className="text-white text-2xl font-bold">Start Test</button>}
      {status === 'waiting' && <p className="text-white text-xl">Wait for Green...</p>}
      {status === 'ready' && <p className="text-white text-3xl font-black animate-bounce">CLICK!</p>}
      {status === 'result' && (
        <div className="text-center text-white">
          <p className="text-lg">Your Time:</p>
          <p className="text-5xl font-bold">{score}ms</p>
          <button onClick={startTest} className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg">Try Again</button>
        </div>
      )}
    </div>
  );
};

export default ReactionTest;