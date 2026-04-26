import React, { useState } from 'react';

const SpeedTest = () => {
  const [speed, setSpeed] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const runTest = async () => {
    setTesting(true);
    setSpeed(null);

    try {
      const imageAddr = "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg"; // ~2MB image
      const downloadSize = 2097152; // bytes (approx 2MB)

      const startTime = new Date().getTime();

      const response = await fetch(imageAddr + "?cache=" + Math.random(), {
        cache: "no-store",
      });

      await response.blob();

      const endTime = new Date().getTime();
      const duration = (endTime - startTime) / 1000;

      const bitsLoaded = downloadSize * 8;
      const speedBps = bitsLoaded / duration;
      const speedMbps = (speedBps / (1024 * 1024)).toFixed(2);

      setSpeed(speedMbps);
    } catch (error) {
      setSpeed("Error");
    }

    setTesting(false);
  };

  return (
    <div className="p-8 bg-black text-white rounded-3xl text-center border-4 border-blue-600">
      <div className="text-5xl font-black mb-4">
        {testing ? '...' : speed || '0.0'} <span className="text-xl">Mbps</span>
      </div>

      <button
        disabled={testing}
        onClick={runTest}
        className="bg-blue-600 hover:bg-blue-700 px-10 py-3 rounded-full font-bold transition-all"
      >
        {testing ? 'Testing...' : 'GO'}
      </button>
    </div>
  );
};

export default SpeedTest;