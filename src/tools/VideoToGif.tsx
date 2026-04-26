import { useState, useRef } from 'react';
import { Film, Upload, Download, Loader2 } from 'lucide-react';

export default function VideoToGif() {
  const [file, setFile] = useState<File | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) return alert('Max file size 20MB for browser processing.');
    setFile(f);
    setGifUrl(null);
  };

  const convert = async () => {
    if (!file || !videoRef.current) return;
    setProcessing(true);

    try {
      const video = videoRef.current;
      video.src = URL.createObjectURL(file);
      video.muted = true;
      
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });

      const canvas = document.createElement('canvas');
      // Scale down to save memory and processing power
      const scale = Math.min(1, 480 / video.videoWidth);
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error("Canvas not supported");

      // Capture canvas stream at 15fps
      const stream = canvas.captureStream(15);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setGifUrl(URL.createObjectURL(blob));
        setProcessing(false);
      };

      recorder.start();
      video.play();

      const draw = () => {
        if (video.paused || video.ended) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(draw);
      };
      
      video.addEventListener('play', draw);
      video.onended = () => {
        recorder.stop();
        video.removeEventListener('play', draw);
      };

    } catch (e) {
      alert('Failed to convert video. Your browser might not support this feature.');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-pink-50 dark:bg-pink-900/30 p-3 rounded-xl">
            <Film className="text-pink-600 dark:text-pink-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold dark:text-white">Video to Looping WebM (GIF Alternative)</h2>
            <p className="text-sm text-gray-500">Converts video into a lightweight, looping WebM format (modern GIF).</p>
          </div>
        </div>

        {!file ? (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-pink-300 border-dashed rounded-3xl cursor-pointer bg-pink-50/50 dark:bg-pink-900/10 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all">
            <Upload className="w-8 h-8 text-pink-500 mb-2" />
            <span className="font-bold text-pink-600 dark:text-pink-400">Upload Short Video Clip</span>
            <p className="text-sm text-gray-500 mt-1">Max 20MB. Short clips work best.</p>
            <input type="file" className="hidden" accept="video/*" onChange={handleUpload} />
          </label>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
              <span className="font-bold text-gray-700 dark:text-gray-300 truncate mr-4">{file.name}</span>
              <button onClick={() => {setFile(null); setGifUrl(null);}} className="text-sm text-red-500 hover:text-red-600 font-bold shrink-0">Clear</button>
            </div>

            {!gifUrl && (
              <button 
                onClick={convert}
                disabled={processing}
                className="w-full py-4 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center shadow-lg shadow-pink-500/30"
              >
                {processing ? (
                  <><Loader2 className="animate-spin mr-2" size={20} /> Converting (Please wait until video finishes...)</>
                ) : (
                  <><Film className="mr-2" size={20} /> Convert Now</>
                )}
              </button>
            )}

            <div className="flex justify-center">
              <video ref={videoRef} className={`max-w-full max-h-64 rounded-xl shadow-sm ${!processing && !gifUrl ? 'hidden' : ''}`} muted playsInline />
            </div>

            {gifUrl && (
              <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-2xl border border-pink-200 dark:border-pink-800/30 space-y-4 text-center">
                <h3 className="font-bold text-pink-900 dark:text-pink-300">Conversion Complete!</h3>
                <p className="text-sm text-pink-700 dark:text-pink-400">Your looping WebM is ready. It plays exactly like a GIF but with better quality and smaller file size.</p>
                <a 
                  href={gifUrl} 
                  download={`loop-${file.name}.webm`}
                  className="inline-flex items-center justify-center px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold transition-colors shadow-sm"
                >
                  <Download size={18} className="mr-2" /> Download WebM
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
