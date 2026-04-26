import React, { useState } from 'react';

const SpinWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const newRotation = rotation + 1800 + Math.random() * 360;
    setRotation(newRotation);
    setTimeout(() => setSpinning(false), 3000);
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
        className="w-48 h-48 rounded-full border-8 border-gray-800 bg-conic-gradient flex items-center justify-center overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#ff0000_0deg_90deg,#00ff00_90deg_180deg,#0000ff_180deg_270deg,#ffff00_270deg_360deg)] opacity-50" />
        <span className="z-10 font-bold">SPIN</span>
      </div>
      <button onClick={spin} className="mt-6 bg-black text-white px-8 py-2 rounded-full font-bold">PUSH LUCK</button>
    </div>
  );
};

export default SpinWheel;