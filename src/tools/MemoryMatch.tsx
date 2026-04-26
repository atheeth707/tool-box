import React, { useState, useEffect } from 'react';

const emojis = ['🔥', '💎', '🍀', '🍎', '👻', '🍕'];

const MemoryMatch = () => {
  const [cards, setCards] = useState([...emojis, ...emojis].sort(() => Math.random() - 0.5));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);

  const handleFlip = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || solved.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setSolved([...solved, ...newFlipped]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
      {cards.map((emoji, i) => (
        <div 
          key={i} 
          onClick={() => handleFlip(i)}
          className={`h-16 flex items-center justify-center text-2xl cursor-pointer rounded-lg bg-gray-200 transition-transform ${flipped.includes(i) || solved.includes(i) ? 'rotate-y-180' : 'bg-blue-500'}`}
        >
          {(flipped.includes(i) || solved.includes(i)) ? emoji : '?'}
        </div>
      ))}
    </div>
  );
};

export default MemoryMatch;