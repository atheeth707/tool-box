import React, { useState } from 'react';

const Quiz = () => {
  const questions = [
    { q: "What is 2+2?", a: ["3", "4", "5"], correct: "4" },
    { q: "Capital of France?", a: ["Paris", "Berlin", "Rome"], correct: "Paris" }
  ];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (ans: string) => {
    if (ans === questions[current].correct) setScore(s => s + 1);
    if (current < questions.length - 1) setCurrent(c => c + 1);
    else alert(`Final Score: ${score + (ans === questions[current].correct ? 1 : 0)}`);
  };

  return (
    <div className="p-6 bg-indigo-600 text-white rounded-xl">
      <h3 className="text-lg mb-4">{questions[current].q}</h3>
      <div className="space-y-2">
        {questions[current].a.map(opt => (
          <button key={opt} onClick={() => handleAnswer(opt)} className="w-full bg-white/10 hover:bg-white/20 p-2 rounded text-left">
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;