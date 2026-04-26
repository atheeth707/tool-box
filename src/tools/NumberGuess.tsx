import React, { useState } from 'react';

const NumberGuess = () => {
  const [target] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Guess a number between 1 and 100');

  const checkGuess = () => {
    const val = parseInt(guess);
    if (val === target) setMessage('CORRECT! 🏆');
    else if (val < target) setMessage('Too Low! 👇');
    else setMessage('Too High! 👆');
  };

  return (
    <div className="p-6 bg-white border-2 border-gray-100 rounded-xl text-center">
      <p className="mb-4 font-semibold">{message}</p>
      <input 
        type="number" 
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        className="border p-2 rounded mr-2 w-20"
      />
      <button onClick={checkGuess} className="bg-green-500 text-white px-4 py-2 rounded">Guess</button>
    </div>
  );
};

export default NumberGuess;