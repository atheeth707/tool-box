import { useState } from 'react';

export default function BasicCalculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const append = (val: string) => {
    if (display === '0' && val !== '.') setDisplay(val);
    else setDisplay(display + val);
  };

  const calculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(display.replace(/×/g, '*').replace(/÷/g, '/'));
      setEquation(display + ' =');
      setDisplay(String(result));
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  const backspace = () => {
    if (display.length > 1) setDisplay(display.slice(0, -1));
    else setDisplay('0');
  };

  const buttons = [
    ['C', '⌫', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  return (
    <div className="max-w-sm mx-auto bg-gray-900 p-6 rounded-3xl shadow-2xl border border-gray-800">
      <div className="bg-gray-800 p-4 rounded-2xl mb-6 text-right min-h-[100px] flex flex-col justify-end">
        <div className="text-gray-400 text-sm h-5">{equation}</div>
        <div className="text-white text-5xl font-light tracking-wider overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide">{display}</div>
      </div>

      <div className="grid gap-3">
        {buttons.map((row, i) => (
          <div key={i} className={`grid ${row.length === 3 ? 'grid-cols-4 gap-3 [&>*:first-child]:col-span-2' : 'grid-cols-4 gap-3'}`}>
            {row.map((btn) => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === 'C') clear();
                  else if (btn === '⌫') backspace();
                  else if (btn === '=') calculate();
                  else append(btn);
                }}
                className={`p-4 text-2xl rounded-2xl font-medium transition-colors ${
                  btn === '=' ? 'bg-blue-600 hover:bg-blue-500 text-white' :
                  ['÷', '×', '-', '+'].includes(btn) ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' :
                  ['C', '⌫', '%'].includes(btn) ? 'bg-gray-700 hover:bg-gray-600 text-red-400' :
                  'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                {btn}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
