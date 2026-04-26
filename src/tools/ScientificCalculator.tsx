import { useState } from 'react';

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState('');
  const [angleMode, setAngleMode] = useState<'deg'|'rad'>('deg');

  const safeEval = (expr: string) => {
    try {
      let parsed = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**')
        .replace(/π/g, 'PI')
        .replace(/√\(/g, 'sqrt(');
      
      const funcBody = `
        const PI = Math.PI;
        const e = Math.E;
        const sqrt = Math.sqrt;
        const log = Math.log10;
        const ln = Math.log;
        const toRad = ${angleMode === 'deg' ? '(Math.PI/180)' : '1'};
        const sin = (x) => Math.sin(x * toRad);
        const cos = (x) => Math.cos(x * toRad);
        const tan = (x) => Math.tan(x * toRad);
        return (${parsed});
      `;
      // eslint-disable-next-line no-new-func
      const func = new Function(funcBody);
      const result = func();
      
      if (!isFinite(result) || isNaN(result)) return 'Error';
      return String(Number(result.toFixed(10)));
    } catch (e) {
      return 'Error';
    }
  };

  const append = (val: string) => {
    if (display === '0' || display === 'Error') {
      if (['+', '-', '×', '÷', '^'].includes(val)) setDisplay('0' + val);
      else setDisplay(val);
    } else {
      setDisplay(display + val);
    }
  };

  const calculate = () => {
    if (display === 'Error') return;
    setHistory(display + ' =');
    setDisplay(safeEval(display));
  };

  const clear = () => {
    setDisplay('0');
    setHistory('');
  };

  const backspace = () => {
    if (display === 'Error') setDisplay('0');
    else if (display.length > 1) setDisplay(display.slice(0, -1));
    else setDisplay('0');
  };

  const buttons = [
    ['sin(', 'cos(', 'tan(', 'C', '⌫'],
    ['log(', 'ln(', '√(', '(', ')'],
    ['π', 'e', '^', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  return (
    <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-3xl shadow-2xl border border-gray-800">
      <div className="flex justify-between items-center mb-4 px-2">
        <span className="text-gray-400 font-semibold text-sm tracking-wider">SCIENTIFIC</span>
        <button 
          onClick={() => setAngleMode(angleMode === 'deg' ? 'rad' : 'deg')}
          className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded-lg text-sm font-bold transition-colors border border-gray-700"
        >
          {angleMode === 'deg' ? 'DEG' : 'RAD'}
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-2xl mb-6 text-right min-h-[120px] flex flex-col justify-end border border-gray-700 shadow-inner">
        <div className="text-gray-400 text-sm h-6 break-all">{history}</div>
        <div className="text-white text-4xl font-light tracking-wider overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide">{display}</div>
      </div>

      <div className="grid gap-2 md:gap-3">
        {buttons.map((row, i) => (
          <div key={i} className={`grid ${row.length === 5 ? 'grid-cols-5' : row.length === 4 ? 'grid-cols-4' : 'grid-cols-5 gap-2 md:gap-3'} ${i > 2 ? 'grid-cols-4' : ''} gap-2 md:gap-3`}>
            {row.map((btn) => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === 'C') clear();
                  else if (btn === '⌫') backspace();
                  else if (btn === '=') calculate();
                  else append(btn);
                }}
                className={`p-3 md:p-4 text-lg md:text-xl rounded-xl font-bold transition-colors shadow-sm ${
                  btn === '=' ? 'col-span-2 bg-blue-600 hover:bg-blue-500 text-white' :
                  ['÷', '×', '-', '+'].includes(btn) ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' :
                  ['C', '⌫'].includes(btn) ? 'bg-gray-700 hover:bg-gray-600 text-red-400' :
                  ['sin(', 'cos(', 'tan(', 'log(', 'ln(', '√(', 'π', 'e', '^', '%', '(', ')'].includes(btn) ? 'bg-gray-800 hover:bg-gray-700 text-amber-400 text-base' :
                  'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                {btn.replace('(', '')}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
