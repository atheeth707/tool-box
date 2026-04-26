import React, { useState } from 'react';

const RPS = () => {
  const choices = ['Rock', 'Paper', 'Scissors'];
  const [score, setScore] = useState(0);
  const [result, setResult] = useState('');

  const play = (userChoice: string) => {
    const aiChoice = choices[Math.floor(Math.random() * 3)];
    if (userChoice === aiChoice) setResult(`Tie! Both chose ${aiChoice}`);
    else if (
      (userChoice === 'Rock' && aiChoice === 'Scissors') ||
      (userChoice === 'Paper' && aiChoice === 'Rock') ||
      (userChoice === 'Scissors' && aiChoice === 'Paper')
    ) {
      setResult(`Win! ${userChoice} beats ${aiChoice}`);
      setScore(s => s + 1);
    } else {
      setResult(`Loss! ${aiChoice} beats ${userChoice}`);
    }
  };

  return (
    <div className="p-6 text-center bg-gray-50 rounded-xl">
      <div className="text-xl mb-4 font-bold">Score: {score}</div>
      <div className="flex justify-center gap-4 mb-4">
        {choices.map(c => (
          <button key={c} onClick={() => play(c)} className="bg-white shadow px-4 py-2 rounded hover:bg-blue-50 transition">{c}</button>
        ))}
      </div>
      <p className="text-lg font-medium text-blue-600">{result}</p>
    </div>
  );
};

export default RPS;