import { useState } from 'react';
import { FileText, Download, Plus, Trash2 } from 'lucide-react';

export default function InvoiceGenerator() {
  const [invoice, setInvoice] = useState({
    company: 'Your Company Name',
    client: 'Client Name',
    date: new Date().toISOString().split('T')[0],
    number: 'INV-001',
    items: [{ desc: 'Web Design', qty: 1, price: 500 }],
    tax: 0
  });

  const subtotal = invoice.items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const taxAmount = (subtotal * invoice.tax) / 100;
  const total = subtotal + taxAmount;

  const handleDownload = () => {
    window.print(); // Quickest way to export PDF client-side without heavy libraries
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 print:shadow-none print:border-none print:p-0">
        
        <div className="flex justify-between items-center mb-8 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
              <FileText className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold dark:text-white">Invoice Generator</h2>
          </div>
          <button onClick={handleDownload} className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-sm">
            <Download size={18} className="mr-2" /> Save PDF
          </button>
        </div>

        {/* Invoice Body */}
        <div className="p-8 border border-gray-200 dark:border-gray-700 rounded-2xl print:border-none print:p-0">
          <div className="flex justify-between items-start mb-12">
            <div>
              <input type="text" value={invoice.company} onChange={e => setInvoice({...invoice, company: e.target.value})} className="text-3xl font-black bg-transparent outline-none dark:text-white w-full" />
              <div className="mt-4 text-gray-500">
                <div className="text-sm font-bold uppercase mb-1">Bill To:</div>
                <textarea value={invoice.client} onChange={e => setInvoice({...invoice, client: e.target.value})} className="w-full bg-transparent outline-none resize-none h-20" />
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-gray-200 dark:text-gray-700 uppercase tracking-widest mb-4">Invoice</div>
              <div className="flex justify-end items-center space-x-2 mb-2">
                <span className="text-gray-500 font-bold text-sm">Invoice #</span>
                <input type="text" value={invoice.number} onChange={e => setInvoice({...invoice, number: e.target.value})} className="bg-transparent outline-none dark:text-white text-right font-bold w-32" />
              </div>
              <div className="flex justify-end items-center space-x-2">
                <span className="text-gray-500 font-bold text-sm">Date</span>
                <input type="date" value={invoice.date} onChange={e => setInvoice({...invoice, date: e.target.value})} className="bg-transparent outline-none dark:text-white text-right font-bold w-32" />
              </div>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700 text-gray-500 text-sm">
                <th className="text-left pb-3 uppercase">Description</th>
                <th className="text-right pb-3 uppercase w-24">Qty</th>
                <th className="text-right pb-3 uppercase w-32">Price</th>
                <th className="text-right pb-3 uppercase w-32">Total</th>
                <th className="w-10 print:hidden"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {invoice.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3"><input type="text" value={item.desc} onChange={e => {const n=[...invoice.items]; n[idx].desc=e.target.value; setInvoice({...invoice, items: n})}} className="w-full bg-transparent outline-none dark:text-white font-medium" /></td>
                  <td className="py-3"><input type="number" value={item.qty} onChange={e => {const n=[...invoice.items]; n[idx].qty=Number(e.target.value); setInvoice({...invoice, items: n})}} className="w-full bg-transparent outline-none dark:text-white text-right" /></td>
                  <td className="py-3"><input type="number" value={item.price} onChange={e => {const n=[...invoice.items]; n[idx].price=Number(e.target.value); setInvoice({...invoice, items: n})}} className="w-full bg-transparent outline-none dark:text-white text-right" /></td>
                  <td className="py-3 text-right font-bold dark:text-white">${(item.qty * item.price).toFixed(2)}</td>
                  <td className="py-3 text-right print:hidden">
                    <button onClick={() => setInvoice({...invoice, items: invoice.items.filter((_, i) => i !== idx)})} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={() => setInvoice({...invoice, items: [...invoice.items, {desc: 'New Item', qty: 1, price: 0}]})} className="mb-8 flex items-center text-sm font-bold text-blue-600 print:hidden">
            <Plus size={16} className="mr-1" /> Add Item
          </button>

          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-gray-500 font-bold">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-bold items-center">
                <span className="flex items-center">Tax <input type="number" value={invoice.tax} onChange={e=>setInvoice({...invoice, tax: Number(e.target.value)})} className="w-12 ml-2 bg-transparent outline-none border-b border-gray-300 dark:border-gray-600 text-center" />%</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-black text-gray-900 dark:text-white pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:hidden { display: none !important; }
          .max-w-4xl { max-width: none !important; margin: 0 !important; }
          .bg-white { background-color: white !important; }
          .dark\\:text-white { color: black !important; }
          .dark\\:bg-gray-800 { background-color: white !important; }
          .dark\\:border-gray-700 { border-color: #e5e7eb !important; }
          .dark\\:divide-gray-800 > :not([hidden]) ~ :not([hidden]) { border-color: #f3f4f6 !important; }
          /* The element we want to print */
          .bg-white > .p-8 { visibility: visible; position: absolute; left: 0; top: 0; width: 100%; }
          .bg-white > .p-8 * { visibility: visible; }
          input, textarea { border: none !important; }
        }
      `}</style>
    </div>
  );
}
