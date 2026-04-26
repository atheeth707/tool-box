import { useState } from 'react';
import { Lock, Unlock, ArrowRight } from 'lucide-react';

export default function EncryptionDemo() {
  const [text, setText] = useState('');
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  // Simple XOR cipher + Base64 for demonstration purposes
  const process = () => {
    if (!text || !key) return setResult('Please enter both text and a secret key.');
    
    try {
      if (mode === 'encrypt') {
        let encrypted = '';
        for (let i = 0; i < text.length; i++) {
          encrypted += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        setResult(btoa(encrypted)); // Encode to base64 to make it printable
      } else {
        let decoded = atob(text);
        let decrypted = '';
        for (let i = 0; i < decoded.length; i++) {
          decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        setResult(decrypted);
      }
    } catch (e) {
      setResult('Error: Invalid input or key for decryption.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-8">
        
        <div className="flex justify-center space-x-4">
          <button onClick={() => {setMode('encrypt'); setResult('');}} className={`flex items-center px-6 py-3 rounded-xl font-bold transition-colors ${mode === 'encrypt' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            <Lock size={18} className="mr-2" /> Encrypt
          </button>
          <button onClick={() => {setMode('decrypt'); setResult('');}} className={`flex items-center px-6 py-3 rounded-xl font-bold transition-colors ${mode === 'decrypt' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            <Unlock size={18} className="mr-2" /> Decrypt
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Secret Key</label>
              <input type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter a secret password..." className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none font-mono" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{mode === 'encrypt' ? 'Plain Text' : 'Encrypted Text (Base64)'}</label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={mode === 'encrypt' ? 'Hello World' : '...'} className="w-full h-40 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none resize-none font-mono" />
            </div>
            <button onClick={process} className={`w-full py-4 text-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center ${mode === 'encrypt' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
              {mode === 'encrypt' ? 'Encrypt Text' : 'Decrypt Text'} <ArrowRight size={20} className="ml-2" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Result</label>
            <textarea readOnly value={result} placeholder="Result will appear here..." className="w-full h-full min-h-[300px] p-6 bg-gray-900 border-2 border-gray-800 rounded-2xl text-green-400 font-mono text-lg outline-none resize-none break-all" />
          </div>
        </div>
        
        <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 text-sm rounded-xl font-medium">
          Note: This is a simple XOR cipher for educational demonstration. Do not use for highly sensitive production data.
        </div>
      </div>
    </div>
  );
}
