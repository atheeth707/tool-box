import React, { useState, useEffect } from 'react';

const BrowserInfo = () => {
  const [info, setInfo] = useState({ ua: '', os: '', size: '' });

  useEffect(() => {
    setInfo({
      ua: navigator.userAgent,
      os: navigator.platform,
      size: `${window.screen.width}x${window.screen.height}`
    });
  }, []);

  return (
    <div className="bg-slate-800 text-slate-200 p-4 rounded-lg font-mono text-sm">
      <p><strong>OS:</strong> {info.os}</p>
      <p className="truncate"><strong>UA:</strong> {info.ua}</p>
      <p><strong>Screen:</strong> {info.size}</p>
    </div>
  );
};
export default BrowserInfo;