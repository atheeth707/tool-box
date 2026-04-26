import { useState } from 'react';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

export default function PasswordStrength() {
  const [password, setPassword] = useState('');

  let score = 0;
  let feedback = [];

  if (password.length > 0) {
    if (password.length < 8) feedback.push("Too short (min 8 chars)");
    else score += 1;
    
    if (password.length >= 12) score += 1;
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push("Add uppercase letters");
    
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("Add lowercase letters");
    
    if (/[0-9]/.test(password)) score += 1;
    else feedback.push("Add numbers");
    
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push("Add special characters");
  }

  // Normalize score to 0-4
  const finalScore = Math.min(Math.floor((score / 6) * 4), 4);
  
  const colors = ['bg-gray-200 dark:bg-gray-700', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-green-500'];
  const labels = ['Empty', 'Weak', 'Fair', 'Good', 'Strong'];
  const textColor = ['text-gray-500', 'text-red-500', 'text-amber-500', 'text-blue-500', 'text-green-500'];
  const Icons = [ShieldX, ShieldAlert, ShieldAlert, ShieldCheck, ShieldCheck];
  const ActiveIcon = Icons[password ? finalScore : 0];

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="mb-8 relative">
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type a password to test..."
          className="w-full p-5 pl-6 pr-14 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-xl font-mono"
        />
        <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
          <ActiveIcon className={`w-6 h-6 ${password ? textColor[finalScore] : 'text-gray-300 dark:text-gray-600'}`} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Strength:</span>
          <span className={`font-bold text-lg ${password ? textColor[finalScore] : 'text-gray-400'}`}>
            {password ? labels[finalScore] : 'None'}
          </span>
        </div>
        
        <div className="flex space-x-2 h-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`flex-1 rounded-full transition-colors duration-300 ${password && i <= finalScore ? colors[finalScore] : 'bg-gray-200 dark:bg-gray-700'}`}></div>
          ))}
        </div>

        {password && feedback.length > 0 && finalScore < 4 && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">How to improve:</h4>
            <ul className="space-y-2">
              {feedback.map((f, i) => (
                <li key={i} className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-3"></span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <p className="text-center text-sm text-gray-500 mt-8">Tested locally in your browser. Passwords are never sent or stored.</p>
    </div>
  );
}
