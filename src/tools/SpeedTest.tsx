const SpeedTest = () => {
  const runTest = async () => {
    const start = Date.now();
    await fetch('https://www.google.com/favicon.ico?cache=' + Math.random());
    const end = Date.now();
    const duration = (end - start) / 1000;
    alert(`Estimated Latency: ${duration.toFixed(2)}s`);
  };
  return <button onClick={runTest} className="bg-blue-600 text-white p-2 rounded">Check Latency</button>;
};
export default SpeedTest;