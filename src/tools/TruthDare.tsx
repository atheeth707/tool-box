import React, { useState } from 'react';

const TruthDare = () => {
  const truths = ["What is your biggest fear?", "Who is your secret crush?"];
  const dares = ["Dance without music", "Call your mom and say I love you"];
  const [content, setContent] = useState('Pick one!');

  return (
    <div className="p-6 bg-red-600 text-white rounded-xl text-center">
      <div className="h-20 flex items-center justify-center font-bold italic mb-6">"{content}"</div>
      <div className="flex gap-4">
        <button onClick={() => setContent(truths[Math.floor(Math.random()*truths.length)])} className="flex-1 bg-white text-red-600 py-3 rounded-lg font-bold">Truth</button>
        <button onClick={() => setContent(dares[Math.floor(Math.random()*dares.length)])} className="flex-1 bg-black text-white py-3 rounded-lg font-bold">Dare</button>
      </div>
    </div>
  );
};

export default TruthDare;