import { useState } from 'react';
import { Copy, ExternalLink, MessageCircle } from 'lucide-react';

export default function WhatsAppLink() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const cleanPhone = phone.replace(/\D/g, '');
  const link = cleanPhone ? `https://wa.me/${cleanPhone}${message ? `?text=${encodeURIComponent(message)}` : ''}` : '';

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-green-500" />
        </div>
        <p className="text-gray-600 dark:text-gray-400">Create a direct link to start a WhatsApp chat without saving the number.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">WhatsApp Number (with country code)</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 1234567890"
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-green-500 outline-none text-lg"
          />
          <p className="text-xs text-gray-500 mt-2 ml-1">Omit any +, -, or leading zeros. Example: 1 for US, 44 for UK.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Pre-filled Message (Optional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hello, I would like to inquire about..."
            className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-green-500 outline-none resize-none text-lg"
          />
        </div>
      </div>

      {link ? (
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-3xl border border-green-100 dark:border-green-800/30 mt-8">
          <p className="text-sm font-bold text-green-800 dark:text-green-400 mb-3 ml-1">Your Generated Link:</p>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <input type="text" readOnly value={link} className="w-full bg-white dark:bg-gray-800 p-4 rounded-xl border border-green-200 dark:border-green-700/50 text-sm dark:text-white font-mono outline-none" />
            <div className="flex space-x-2 w-full sm:w-auto">
              <button onClick={() => navigator.clipboard.writeText(link)} className="flex-1 sm:flex-none p-4 flex justify-center bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors shadow-sm" title="Copy to clipboard">
                <Copy size={20} />
              </button>
              <a href={link} target="_blank" rel="noreferrer" className="flex-1 sm:flex-none p-4 flex justify-center bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 dark:text-gray-900 text-white rounded-xl transition-colors shadow-sm" title="Open in WhatsApp">
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 mt-8">
          Enter a valid phone number to generate your link.
        </div>
      )}
    </div>
  );
}
