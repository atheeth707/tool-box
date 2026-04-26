const PingTool = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const ping = () => {
    const time = Math.floor(Math.random() * 50) + 20;
    setLogs(prev => [...prev, `Reply from 8.8.8.8: time=${time}ms`]);
  };
  return (
    <div className="bg-black text-green-400 p-4 h-40 overflow-y-scroll font-mono">
      {logs.map((l, i) => <div key={i}>{l}</div>)}
      <button onClick={ping} className="text-white border p-1">Ping 8.8.8.8</button>
    </div>
  );
};
export default PingTool;