import { useState } from 'react';
import { FileJson, Download, Copy } from 'lucide-react';

export default function JsonToXml() {
  const [json, setJson] = useState('{\n  "root": {\n    "person": [\n      {\n        "name": "Alice",\n        "age": "28"\n      },\n      {\n        "name": "Bob",\n        "age": "34"\n      }\n    ]\n  }\n}');
  const [xml, setXml] = useState('');

  const convert = () => {
    if (!json.trim()) return setXml('');
    try {
      const data = JSON.parse(json);
      
      const jsonToXml = (obj: any): string => {
        let xml = '';
        for (const prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            if (Array.isArray(obj[prop])) {
              for (const element of obj[prop]) {
                xml += `<${prop}>`;
                xml += typeof element === 'object' ? jsonToXml(element) : element;
                xml += `</${prop}>`;
              }
            } else if (typeof obj[prop] === 'object') {
              xml += `<${prop}>`;
              xml += jsonToXml(obj[prop]);
              xml += `</${prop}>`;
            } else {
              xml += `<${prop}>${obj[prop]}</${prop}>`;
            }
          }
        }
        return xml;
      };

      setXml('<?xml version="1.0" encoding="UTF-8"?>\\n' + jsonToXml(data));
    } catch (e) {
      setXml('Error parsing JSON. Ensure it is a valid JSON object.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-rose-50 dark:bg-rose-900/30 p-3 rounded-xl">
            <FileJson className="text-rose-600 dark:text-rose-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">JSON to XML</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Paste JSON Data</label>
            <textarea
              value={json}
              onChange={(e) => setJson(e.target.value)}
              className="w-full h-[400px] p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-rose-500 outline-none font-mono text-sm resize-none whitespace-pre"
            />
            <button onClick={convert} className="w-full mt-4 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-colors">
              Convert to XML
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">XML Output</label>
            <textarea
              value={xml}
              readOnly
              className="w-full h-[400px] p-5 bg-gray-900 border-2 border-gray-800 rounded-2xl text-rose-400 outline-none font-mono text-sm resize-none whitespace-pre"
            />
            {xml && !xml.startsWith('Error') && (
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button onClick={() => navigator.clipboard.writeText(xml)} className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl shadow-sm transition-colors">
                  <Copy size={20} />
                </button>
                <a 
                  href={`data:text/xml;charset=utf-8,${encodeURIComponent(xml)}`} 
                  download="data.xml"
                  className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm transition-colors"
                >
                  <Download size={20} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
