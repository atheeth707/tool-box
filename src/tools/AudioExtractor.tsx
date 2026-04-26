import { useState, useRef } from 'react';
import { Music, Upload, Download, Loader2 } from 'lucide-react';

export default function AudioExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 50 * 1024 * 1024) return alert('Max file size 50MB for browser processing.');
    setFile(f);
    setAudioUrl(null);
  };

  const extractAudio = async () => {
    if (!file || !videoRef.current) return;
    setProcessing(true);

    try {
      const video = videoRef.current;
      video.src = URL.createObjectURL(file);
      
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });

      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const source = ctx.createMediaElementSource(video);
      const dest = ctx.createMediaStreamDestination();
      
      source.connect(dest);
      // Do not connect to ctx.destination to keep it silent

      const recorder = new MediaRecorder(dest.stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
        setProcessing(false);
        ctx.close();
      };

      recorder.start();
      video.play();

      video.onended = () => {
        recorder.stop();
      };

    } catch (e) {
      alert('Failed to extract audio. Your browser might not support this feature.');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-xl">
            <Music className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold dark:text-white">Extract Audio from Video</h2>
            <p className="text-sm text-gray-500">Processed 100% locally in your browser. Max 50MB.</p>
          </div>
        </div>

        {!file ? (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-purple-300 border-dashed rounded-3xl cursor-pointer bg-purple-50/50 dark:bg-purple-900/10 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all">
            <Upload className="w-8 h-8 text-purple-500 mb-2" />
            <span className="font-bold text-purple-600 dark:text-purple-400">Upload Video File</span>
            <input type="file" className="hidden" accept="video/*" onChange={handleUpload} />
          </label>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
              <span className="font-bold text-gray-700 dark:text-gray-300 truncate mr-4">{file.name}</span>
              <button onClick={() => {setFile(null); setAudioUrl(null);}} className="text-sm text-red-500 hover:text-red-600 font-bold shrink-0">Clear</button>
            </div>

            {!audioUrl && (
              <button 
                onClick={extractAudio}
                disabled={processing}
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center shadow-lg shadow-purple-500/30"
              >
                {processing ? (
                  <><Loader2 className="animate-spin mr-2" size={20} /> Extracting Audio (Please wait...)</>
                ) : (
                  <><Music className="mr-2" size={20} /> Extract Audio Now</>
                )}
              </button>
            )}

            <video ref={videoRef} className="hidden" muted playsInline />

            {audioUrl && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-800/30 space-y-4">
                <h3 className="font-bold text-purple-900 dark:text-purple-300">Extraction Complete!</h3>
                <audio src={audioUrl} controls className="w-full" />
                <a 
                  href={audioUrl} 
                  download={`extracted-${file.name}.webm`}
                  className="flex items-center justify-center w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors shadow-sm"
                >
                  <Download size={18} className="mr-2" /> Download Audio Track
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
