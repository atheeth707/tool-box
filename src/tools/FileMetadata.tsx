import { useState } from 'react';
import { FileSearch, Upload } from 'lucide-react';

export default function FileMetadata() {
  const [file, setFile] = useState<File | null>(null);
  const [extraData, setExtraData] = useState<any>({});

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setExtraData({});

    // Extract extra data for images and videos
    if (f.type.startsWith('image/')) {
      const img = new Image();
      img.onload = () => {
        setExtraData({ Width: `${img.width}px`, Height: `${img.height}px` });
      };
      img.src = URL.createObjectURL(f);
    } else if (f.type.startsWith('video/') || f.type.startsWith('audio/')) {
      const media = document.createElement(f.type.startsWith('video/') ? 'video' : 'audio');
      media.onloadedmetadata = () => {
        const data: any = { Duration: `${Math.round(media.duration)} seconds` };
        if (f.type.startsWith('video/')) {
          data.Width = `${(media as HTMLVideoElement).videoWidth}px`;
          data.Height = `${(media as HTMLVideoElement).videoHeight}px`;
        }
        setExtraData(data);
      };
      media.src = URL.createObjectURL(f);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileSearch className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold dark:text-white mb-2">File Metadata Viewer</h2>
        <p className="text-gray-500 mb-8">View hidden details about your files without uploading them to any server.</p>

        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-blue-300 border-dashed rounded-3xl cursor-pointer bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 transition-all">
          <Upload className="w-8 h-8 text-blue-500 mb-2" />
          <span className="font-bold text-blue-600 dark:text-blue-400">Select any file</span>
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {file && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold dark:text-white mb-6">File Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-500 uppercase mb-1">File Name</div>
              <div className="font-bold text-gray-900 dark:text-white break-all">{file.name}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-500 uppercase mb-1">File Size</div>
              <div className="font-bold text-gray-900 dark:text-white">{formatBytes(file.size)}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-500 uppercase mb-1">MIME Type</div>
              <div className="font-bold text-gray-900 dark:text-white">{file.type || 'Unknown'}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-500 uppercase mb-1">Last Modified</div>
              <div className="font-bold text-gray-900 dark:text-white">{new Date(file.lastModified).toLocaleString()}</div>
            </div>
            
            {Object.entries(extraData).map(([key, val]) => (
              <div key={key} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                <div className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase mb-1">{key}</div>
                <div className="font-bold text-blue-900 dark:text-blue-100">{val as string}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
