import { useState } from 'react';
import { KeyRound, ShieldAlert } from 'lucide-react';

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');

  const decode = (t: string) => {
    setToken(t);
    setError('');
    if (!t) {
      setHeader(''); setPayload(''); setSignature('');
      return;
    }

    try {
      const parts = t.split('.');
      if (parts.length !== 3) throw new Error('JWT must have 3 parts (Header, Payload, Signature)');

      const h = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const p = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      
      setHeader(JSON.stringify(h, null, 2));
      setPayload(JSON.stringify(p, null, 2));
      setSignature(parts[2]);
    } catch (e: any) {
      setError(e.message || 'Invalid JWT signature or format');
      setHeader(''); setPayload(''); setSignature('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-rose-50 dark:bg-rose-900/30 p-3 rounded-xl">
            <KeyRound className="text-rose-600 dark:text-rose-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">JWT Decoder</h2>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Paste JSON Web Token</label>
          <textarea
            value={token}
            onChange={(e) => decode(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            className="w-full h-32 p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-rose-500 outline-none font-mono text-sm resize-none break-all"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center border border-red-100 dark:border-red-800/30">
          <ShieldAlert size={20} className="mr-2 shrink-0" />
          <span className="font-bold">{error}</span>
        </div>
      )}

      {(header || payload) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800">
            <h3 className="font-bold text-rose-400 mb-4">Header (Algorithm & Type)</h3>
            <pre className="text-rose-200 font-mono text-sm overflow-x-auto">{header}</pre>
          </div>
          <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800">
            <h3 className="font-bold text-purple-400 mb-4">Payload (Data)</h3>
            <pre className="text-purple-200 font-mono text-sm overflow-x-auto">{payload}</pre>
          </div>
          <div className="md:col-span-2 bg-gray-900 p-6 rounded-3xl border border-gray-800">
            <h3 className="font-bold text-cyan-400 mb-4">Signature</h3>
            <div className="text-cyan-200 font-mono text-sm break-all">{signature}</div>
          </div>
        </div>
      )}
    </div>
  );
}
