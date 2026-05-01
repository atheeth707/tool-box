import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Trophy, ArrowRight, RefreshCcw, Timer } from 'lucide-react';

interface Question {
  q: string;
  a: string[];
  correct: string;
}

const QUESTIONS: Question[] = [
  { q: "Which hook is used for side effects in React?", a: ["useEffect", "useState", "useContext", "useReducer"], correct: "useEffect" },
  { q: "What does TSX stand for?", a: ["TypeScript XML", "TypeScript Extension", "Terminal Syntax X", "Type Script X-platform"], correct: "TypeScript XML" },
  { q: "Which command starts a Python script?", a: ["run python", "python script.py", "py-execute", "start-py"], correct: "python script.py" },
  { q: "What is the default port for Vite?", a: ["3000", "8080", "5173", "5000"], correct: "5173" }
];

export default function AdvancedQuiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = (ans: string) => {
    if (selectedAnswer) return; // Prevent double-clicking

    setSelectedAnswer(ans);
    const correct = ans === QUESTIONS[current].correct;
    setIsCorrect(correct);
    
    if (correct) setScore(s => s + 1);

    // Delay slightly so user sees the feedback color
    setTimeout(() => {
      if (current < QUESTIONS.length - 1) {
        setCurrent(c => c + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1200);
  };

  const resetQuiz = () => {
    setCurrent(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const progress = ((current + 1) / QUESTIONS.length) * 100;

  if (showResult) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 text-center">
        <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="text-yellow-600" size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Quiz Complete</h2>
        <p className="text-slate-500 mt-2 font-bold uppercase text-xs tracking-widest">Final Performance Score</p>
        
        <div className="my-8 py-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <span className="text-6xl font-black text-indigo-600">{Math.round((score / QUESTIONS.length) * 100)}%</span>
          <p className="text-sm font-bold text-slate-400 mt-2">{score} / {QUESTIONS.length} Correct</p>
        </div>

        <button onClick={resetQuiz} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
          <RefreshCcw size={18} /> Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      {/* Progress Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">Question {current + 1} of {QUESTIONS.length}</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1 uppercase tracking-tighter">Knowledge Assessment</h2>
          </div>
          <div className="text-right">
            <span className="text-xs font-black text-slate-400 uppercase">Score: {score}</span>
          </div>
        </div>
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl" />
        
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 relative z-10">
          {QUESTIONS[current].q}
        </h3>

        <div className="grid gap-3 relative z-10">
          {QUESTIONS[current].a.map((opt) => {
            const isSelected = selectedAnswer === opt;
            const isThisCorrect = opt === QUESTIONS[current].correct;
            
            let btnStyle = "bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300";
            if (isSelected) {
              btnStyle = isCorrect ? "bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20" : "bg-red-50 border-red-500 text-red-700 dark:bg-red-900/20";
            } else if (selectedAnswer && isThisCorrect) {
              btnStyle = "bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20";
            }

            return (
              <button
                key={opt}
                disabled={!!selectedAnswer}
                onClick={() => handleAnswer(opt)}
                className={`w-full p-5 rounded-2xl border-2 text-left font-bold transition-all flex justify-between items-center group ${btnStyle} ${!selectedAnswer && 'hover:border-indigo-500 hover:bg-indigo-50/50'}`}
              >
                {opt}
                {isSelected && (
                  isCorrect ? <CheckCircle2 className="text-green-500" size={20} /> : <XCircle className="text-red-500" size={20} />
                )}
                {!selectedAnswer && <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
        Logic Engine Verified • TypeScript Powered
      </p>
    </div>
  );
}