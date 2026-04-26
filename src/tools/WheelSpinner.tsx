import { useState, useRef, useEffect } from 'react';
import { RotateCw } from 'lucide-react';

export default function WheelSpinner() {
  const [items, setItems] = useState('Prize 1\nPrize 2\nPrize 3\nPrize 4\nPrize 5\nPrize 6');
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);

  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F43F5E'];

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const options = items.split('\n').filter(i => i.trim() !== '');
    if (options.length === 0) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = Math.min(cx, cy) - 10;
    const sliceAngle = (2 * Math.PI) / options.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotationRef.current);

    options.forEach((opt, i) => {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, i * sliceAngle, (i + 1) * sliceAngle);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.rotate(i * sliceAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(opt, radius - 20, 5);
      ctx.restore();
    });

    ctx.restore();

    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(cx + radius - 10, cy);
    ctx.lineTo(cx + radius + 15, cy - 10);
    ctx.lineTo(cx + radius + 15, cy + 10);
    ctx.fillStyle = '#1F2937';
    ctx.fill();
  };

  useEffect(() => {
    drawWheel();
  }, [items]);

  const spin = () => {
    if (spinning) return;
    const options = items.split('\n').filter(i => i.trim() !== '');
    if (options.length < 2) return alert('Need at least 2 items to spin.');

    setSpinning(true);
    setWinner(null);

    const spinAngle = Math.random() * Math.PI * 2 + Math.PI * 10; // min 5 rotations
    const duration = 4000;
    const start = performance.now();
    const startRotation = rotationRef.current;

    const animate = (time: number) => {
      const elapsed = time - start;
      if (elapsed < duration) {
        // Easing out
        const t = elapsed / duration;
        const easeOut = 1 - Math.pow(1 - t, 3);
        rotationRef.current = startRotation + spinAngle * easeOut;
        drawWheel();
        requestAnimationFrame(animate);
      } else {
        rotationRef.current = startRotation + spinAngle;
        drawWheel();
        setSpinning(false);
        
        // Calculate winner
        const normalizedRot = (rotationRef.current % (2 * Math.PI));
        // Pointer is at 0 radians (right side). We need to find which slice is at -normalizedRot
        const sliceAngle = (2 * Math.PI) / options.length;
        let winningAngle = (2 * Math.PI - normalizedRot) % (2 * Math.PI);
        const winningIndex = Math.floor(winningAngle / sliceAngle);
        setWinner(options[winningIndex]);
      }
    };
    requestAnimationFrame(animate);
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
        <h2 className="text-2xl font-bold dark:text-white mb-2">Wheel Items</h2>
        <p className="text-sm text-gray-500 mb-4">One item per line</p>
        <textarea
          value={items}
          onChange={(e) => setItems(e.target.value)}
          className="flex-1 w-full min-h-[300px] p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none resize-none text-lg mb-6"
        />
      </div>

      <div className="lg:col-span-8 bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
        <div className="relative w-full max-w-[400px] aspect-square mb-8">
          <canvas ref={canvasRef} width={400} height={400} className="w-full h-full drop-shadow-2xl" />
        </div>
        
        <button 
          onClick={spin}
          disabled={spinning}
          className="px-12 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-full font-black text-2xl transition-all shadow-lg shadow-blue-500/40 hover:scale-105 active:scale-95 flex items-center"
        >
          <RotateCw size={24} className={`mr-3 ${spinning ? 'animate-spin' : ''}`} />
          {spinning ? 'Spinning...' : 'SPIN THE WHEEL'}
        </button>

        {winner && !spinning && (
          <div className="mt-8 text-center animate-fade-in">
            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Winner</div>
            <div className="text-4xl font-black text-blue-600 dark:text-blue-400">{winner}</div>
          </div>
        )}
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
