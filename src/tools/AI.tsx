import { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';

export default function AI() {

  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      text:
        'Hello 👋 I am Toolbox AI. Ask me anything or ask for tools like image to pdf, QR generator, background remover and more.'
    }
  ]);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = {
      role: 'user',
      text: message
    };

    setMessages(prev => [...prev, userMessage]);

    const currentMessage = message;

    setMessage('');

    setLoading(true);

    try {

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: currentMessage
        })
      });

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply
        }
      ]);

    } catch (error) {

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'Something went wrong.'
        }
      ]);

    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">

      {/* SEO */}
      <title>Toolbox AI Chat Assistant</title>

      <meta
        name="description"
        content="Chat with Toolbox AI assistant powered by Google Gemini AI."
      />

      {/* Header */}
      <div className="border-b border-gray-200 dark:border-zinc-800 bg-white/90 dark:bg-black/90 backdrop-blur sticky top-0 z-20">

        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">

          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">

            <Sparkles className="text-white w-5 h-5" />

          </div>

          <div>

            <h1 className="font-bold text-gray-900 dark:text-white">
              Toolbox AI
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by Gemini AI
            </p>

          </div>

        </div>

      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`flex ${
                msg.role === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >

              <div
                className={`max-w-[85%] rounded-3xl px-5 py-4 whitespace-pre-line leading-7 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white'
                }`}
              >
                {msg.text}
              </div>

            </div>

          ))}

          {loading && (

            <div className="flex justify-start">

              <div className="bg-gray-100 dark:bg-zinc-900 px-5 py-4 rounded-3xl text-gray-600 dark:text-gray-300">

                Toolbox AI is thinking...

              </div>

            </div>

          )}

        </div>

      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-black sticky bottom-0">

        <div className="max-w-4xl mx-auto p-4">

          <div className="flex items-end gap-3 bg-gray-100 dark:bg-zinc-900 rounded-3xl p-3">

            <textarea
              placeholder="Message Toolbox AI..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-gray-900 dark:text-white max-h-40"
            />

            <button
              onClick={sendMessage}
              className="w-12 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center text-white shrink-0"
            >

              <Send className="w-5 h-5" />

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}