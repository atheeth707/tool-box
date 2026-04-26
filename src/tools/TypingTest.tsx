import React, { useState, useEffect } from 'react';

const TypingTest = () => {
  const text = "The quick brown fox jumps over the lazy dog near the river.";
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);

  useEffect(() => {
    if (input.length === 1 && !startTime) setStartTime(Date.now());
    if (input === text && startTime) {
      const timeTaken = (Date.now() - startTime) / 1000 / 60;
      setWpm(Math.round((text.length / 5) / timeTaken));
    }
  }, [input]);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl shadow-lg">
      <p className="mb-4 text-gray-400 select-none italic">"{text}"</p>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Start typing..."
      />
      {input === text && (
        <div className="mt-4 text-green-400 font-bold animate-pulse text-2xl">
          WPM: {wpm} 🚀
        </div>
      )}
    </div>
  );
};

export default TypingTest;