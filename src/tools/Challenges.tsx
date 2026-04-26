import React, { useState } from 'react';

const Challenges = () => {
  const list = ["Do 10 Pushups", "Drink 1L of Water", "No sugar for 1 hour", "Text your best friend"];
  const [task, setTask] = useState(list[0]);

  return (
    <div className="p-8 bg-yellow-400 text-black text-center rounded-2xl shadow-xl">
      <h2 className="text-xs uppercase tracking-widest font-bold mb-2">Your Challenge:</h2>
      <p className="text-2xl font-black mb-6">"{task}"</p>
      <button 
        onClick={() => setTask(list[Math.floor(Math.random()*list.length)])}
        className="bg-black text-white px-6 py-2 rounded-lg"
      >
        New Challenge
      </button>
    </div>
  );
};

export default Challenges;