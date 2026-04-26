import { useState } from 'react';
import { Download, FileText, Image, RotateCcw, AlertCircle } from 'lucide-react';

const MIME_OPTIONS = [
  { label: 'Auto Detect', value: 'auto' },
  { label: 'PNG Image', value: 'image/png' },
  { label: 'JPEG Image', value: 'image/jpeg' },
  { label: 'WebP Image', value: 'image/webp' },
  { label: 'GIF Image', value: 'image/gif' },
  { label: 'PDF Document', value: 'application/pdf' },
  { label: 'Text File', value: 'text/plain' },
  { label: 'JSON File', value: 'application/json' },
  { label: 'ZIP Archive', value: 'application/zip' },
  { label: 'MP3 Audio', value: 'audio/mpeg' },
  { label: 'MP4 Video', value: 'video/mp4' },
];

const EXT_MAP: Record<string, string> = {
  'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif',
  'application/pdf': 'pdf', 'text/plain': 'txt', 'application/json': 'json',
  'application/zip': 'zip', 'audio/mpeg': 'mp3', 'video/mp4': 'mp4',
};

const detectMime = (b64: string): string => {
  try {
    const clean = b64.replace(/^data:[^;]+;base64,/, '').trim();
    const bytes = atob(clean.slice(0, 16));
    const sig = bytes.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('').toUpperCase();
    if (sig.startsWith('89504E47')) return 'image/png';
    if (sig.startsWith('FFD8FF')) return 'image/jpeg';
    if (sig.startsWith('47494638')) return 'image/gif';
    if (sig.startsWith('25504446')) return 'application/pdf';
    if (sig.startsWith('504B0304')) return 'application/zip';
    if (sig.startsWith('49443303') || sig.startsWith('FFFB') || sig.startsWith('FFF3')) return 'audio/mpeg';
    const text = atob(clean.slice(0, 64));
    if (text.trimStart().startsWith('{') || text.trimStart().startsWith('[')) return 'application/json';
    return 'application/octet-stream';
  } catch {
    return 'application/octet-stream';
  }
};

export default function Base64FileDecoder() {
  const [input, setInput] = useState('');
  const [mimeType, setMimeType] = useState('auto');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [decoded, setDecoded] = useState(false);

  const getBase64Clean = () => input.replace(/^data:[^;]+;base64,/, '').replace(/\s/g, '');

  const handleDecode = () => {
    setError('');
    setPreview(null);
    setDecoded(false);
    if (!input.trim()) return setError('Please paste a Base64 string first.');
    try {
      const clean = getBase64Clean();
      atob(clean); // validate
      const detected = mimeType === 'auto' ? detectMime(input) : mimeType;
      if (detected.startsWith('image/')) {
        setPreview(`data:${detected};base64,${clean}`);
      }
      setDecoded(true);
    } catch {
      setError('Invalid Base64 string. Please check your input.');
    }
  };

  const handleDownload = () => {
    try {
      const clean = getBase64Clean();
      const detected = mimeType === 'auto' ? detectMime(input) : mimeType;
      const binary = atob(clean);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: detected });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `decoded-file.${EXT_MAP[detected] || 'bin'}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Failed to decode. Please check your Base64 input.');
    }
  };

  const handleReset = () => {
    setInput('');
    setMimeType('auto');
    setError('');
    setPreview(null);
    setDecoded(false);
  };

  const charCount = getBase64Clean().length;
  const approxSize = charCount ? Math.round((charCount * 3) / 4 / 1024) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-5">

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Paste Base64 String
            </label>
            {charCount > 0 && (
              <span className="text-xs text-gray-400">~{approxSize} KB decoded</span>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setDecoded(false); setError(''); }}
            rows={7}
            placeholder="Paste your Base64 encoded string here...&#10;&#10;Supports: raw base64 or data URI format&#10;e.g. data:image/png;base64,iVBORw0KGgo..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-mono text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            File Type
          </label>
          <select
            value={mimeType}
            onChange={(e) => setMimeType(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {MIME_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {mimeType === 'auto' && (
            <p className="text-xs text-gray-400 mt-1">Auto detect reads the file signature (magic bytes)</p>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleDecode}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/30"
          >
            <FileText size={18} /> Decode
          </button>
          {decoded && (
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-green-500/30"
            >
              <Download size={18} /> Download File
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {preview && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Image size={18} className="text-blue-500" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Image Preview</h3>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 flex justify-center items-center min-h-[200px] border border-dashed border-gray-200 dark:border-gray-700">
            <img src={preview} alt="Decoded" className="max-w-full max-h-[400px] object-contain rounded-xl shadow-sm" />
          </div>
        </div>
      )}

      {decoded && !preview && (
        <div className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-4 border border-green-100 dark:border-green-800">
          <p className="text-sm font-semibold text-green-700 dark:text-green-400">
            ✓ Decoded successfully — click Download File to save
          </p>
          <p className="text-sm text-green-600 dark:text-green-300 mt-1">
            Approx size: {approxSize} KB · Type: {mimeType === 'auto' ? detectMime(input) : mimeType}
          </p>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-4 border border-blue-100 dark:border-blue-800">
        <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">How to use</p>
        <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1 list-disc list-inside">
          <li>Paste any Base64 string (raw or data URI format)</li>
          <li>Select file type or use Auto Detect</li>
          <li>Click Decode to preview (images shown instantly)</li>
          <li>Click Download File to save to your device</li>
        </ul>
      </div>
    </div>
  );
}
