import { useState } from 'react';
import { Code2, Download, Copy } from 'lucide-react';

export default function XmlToJson() {
  const [xml, setXml] = useState('<root>\\n  <person>\\n    <name>Alice</name>\\n    <age>28</age>\\n  </person>\\n  <person>\\n    <name>Bob</name>\\n    <age>34</age>\\n  </person>\\n</root>');
  const [json, setJson] = useState('');

  const convert = () => {
    if (!xml.trim()) return setJson('');
    try {
      const parser = new DOMParser();
      const dom = parser.parseFromString(xml, "text/xml");
      if (dom.querySelector('parsererror')) {
        return setJson('Error parsing XML');
      }

      const domToJson = (node: any) => {
        let obj: any = {};
        if (node.nodeType === 1) { // element
          if (node.attributes.length > 0) {
            obj["@attributes"] = {};
            for (let j = 0; j < node.attributes.length; j++) {
              const attribute = node.attributes.item(j);
              obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
          }
        } else if (node.nodeType === 3) { // text
          obj = node.nodeValue;
        }

        if (node.hasChildNodes()) {
          for (let i = 0; i < node.childNodes.length; i++) {
            const item = node.childNodes.item(i);
            const nodeName = item.nodeName;
            if (typeof(obj[nodeName]) === "undefined") {
              if (item.nodeType === 3) {
                if (item.nodeValue.trim() !== '') obj = item.nodeValue.trim();
              } else {
                obj[nodeName] = domToJson(item);
              }
            } else {
              if (typeof(obj[nodeName].push) === "undefined") {
                const old = obj[nodeName];
                obj[nodeName] = [];
                obj[nodeName].push(old);
              }
              obj[nodeName].push(domToJson(item));
            }
          }
        }
        return obj;
      };

      setJson(JSON.stringify(domToJson(dom), null, 2));
    } catch (e) {
      setJson('Error parsing XML');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-xl">
            <Code2 className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">XML to JSON</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Paste XML Data</label>
            <textarea
              value={xml}
              onChange={(e) => setXml(e.target.value)}
              className="w-full h-[400px] p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-purple-500 outline-none font-mono text-sm resize-none whitespace-pre"
            />
            <button onClick={convert} className="w-full mt-4 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors">
              Convert to JSON
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">JSON Output</label>
            <textarea
              value={json}
              readOnly
              className="w-full h-[400px] p-5 bg-gray-900 border-2 border-gray-800 rounded-2xl text-purple-400 outline-none font-mono text-sm resize-none whitespace-pre"
            />
            {json && !json.startsWith('Error') && (
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button onClick={() => navigator.clipboard.writeText(json)} className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl shadow-sm transition-colors">
                  <Copy size={20} />
                </button>
                <a 
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(json)}`} 
                  download="data.json"
                  className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm transition-colors"
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
