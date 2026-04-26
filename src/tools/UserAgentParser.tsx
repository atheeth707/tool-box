import { useState, useEffect } from 'react';
import { MonitorSmartphone, Info } from 'lucide-react';

export default function UserAgentParser() {
  const [ua, setUa] = useState('');
  const [parsed, setParsed] = useState<any>({});

  useEffect(() => {
    const agent = navigator.userAgent;
    setUa(agent);
    
    // Simple regex parsing
    const browser = /(chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i.exec(agent) || [];
    const os = /(windows nt|mac os x|android|ios|iphone|ipad|linux)/i.exec(agent) || [];
    const mobile = /Mobile|Android|iP(hone|od|ad)/i.test(agent);

    setParsed({
      browser: browser[1] ? browser[1].replace('Trident', 'IE') : 'Unknown',
      version: browser[2] || 'Unknown',
      os: os[1] || 'Unknown OS',
      device: mobile ? 'Mobile/Tablet' : 'Desktop',
      engine: agent.includes('WebKit') ? 'WebKit' : agent.includes('Gecko') ? 'Gecko' : 'Unknown Engine'
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <Info className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Raw User Agent</h2>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 font-mono text-sm md:text-base text-gray-800 dark:text-gray-300 break-all">
          {ua}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-xl">
            <MonitorSmartphone className="text-green-600 dark:text-green-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Parsed Data</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="text-xs font-bold text-gray-500 uppercase mb-1">Browser</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white capitalize">{parsed.browser} {parsed.version}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="text-xs font-bold text-gray-500 uppercase mb-1">Operating System</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white capitalize">{parsed.os}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="text-xs font-bold text-gray-500 uppercase mb-1">Device Type</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white capitalize">{parsed.device}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="text-xs font-bold text-gray-500 uppercase mb-1">Rendering Engine</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white capitalize">{parsed.engine}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
