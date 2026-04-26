import React, { useState } from 'react';

const PingTool: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const ping = () => {
    const time = Math.floor(Math.random() * 50) + 20;

    setLogs((prev: string[]) => [
      ...prev,
      `Reply from 8.8.8.8: time=${time}ms`
    ]);
  };

  return (
    <div className="bg-black text-green-400 p-4 h-48 rounded-xl overflow-y-auto font-mono space-y-1">

      {logs.map((l: string, i: number) => (
        <div key={i}>{l}</div>
      ))}

      <button
        onClick={ping}
        className="mt-3 px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 text-white rounded border border-gray-600"
      >
        Ping 8.8.8.8
      </button>

    </div>
  );
};

export default PingTool;