import { useState } from 'react';
import { Upload, Download, FileCode } from 'lucide-react';

export default function Base64FileEncoder() {
  const [base64, setBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return alert('File size exceeds 10MB limit.');
    
    setFileName(file.name);
    setFileSize(file.size);
    
    const reader = new FileReader();
    reader.onload = (event) => setBase64(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {!base64 ? (
        <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-blue-300 border-dashed rounded-3xl cursor-pointer bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-blue-500" />
            </div>
            <p className="mb-2 text-lg text-gray-700 dark:text-gray-300"><span className="font-bold text-blue-600 dark:text-blue-400">Click to upload any file</span></p>
            <p className="text-sm text-gray-500">Max file size: 10MB</p>
          </div>
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          <div className="flex justify-between items-center pb-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <FileCode className="mr-3 text-blue-500" size={24}/> 
              <div>
                <h3 className="font-bold dark:text-white">{fileName}</h3>
                <p className="text-xs text-gray-500">{formatBytes(fileSize)}</p>
              </div>
            </div>
            <button onClick={() => {setBase64(''); setFileName('');}} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 rounded-lg transition-colors">Clear File</button>
          </div>
          
          <div className="relative">
            <textarea
              value={base64}
              readOnly
              className="w-full h-96 p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-3xl outline-none dark:text-white text-sm font-mono shadow-sm resize-none break-all"
            />
            <div className="absolute bottom-6 right-6 flex space-x-3">
              <button onClick={() => navigator.clipboard.writeText(base64)} className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl shadow-sm transition-colors font-bold">
                Copy Base64
              </button>
              <a 
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(base64)}`} 
                download={`${fileName}.b64.txt`}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors font-bold flex items-center"
              >
                <Download size={18} className="mr-2" /> Download TXT
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
