import React, { useState, useEffect } from 'react';

const CPSCounter = () => {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const start = () => {
    setClicks(0);
    setTimeLeft(5);
    setIsActive(true);
  };

  return (
    <div className="text-center p-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl text-white">
      <h3 className="text-xl font-bold mb-2">CPS Test (5s)</h3>
      <div className="text-4xl font-black mb-4">{isActive ? timeLeft : 'Ready?'}</div>
      <button 
        onClick={() => isActive ? setClicks(c => c + 1) : start()}
        className="w-32 h-32 rounded-full bg-white text-purple-600 font-bold text-2xl shadow-xl active:scale-95 transition-transform"
      >
        {isActive ? clicks : 'START'}
      </button>
      {!isActive && clicks > 0 && <p className="mt-4">Result: {(clicks / 5).toFixed(1)} CPS</p>}
    </div>
  );
};

export default CPSCounter;