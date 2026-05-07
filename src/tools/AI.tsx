import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AI() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState('');
  const [tool, setTool] = useState<any>(null);

  const askAI = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setReply('');
    setTool(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message
        })
      });

      const data = await response.json();

      setReply(data.reply);
      setTool(data.tool);

    } catch (error) {
      setReply('Something went wrong.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black px-4 py-10">

      {/* SEO */}
      <title>AI Tool Assistant - Free AI Tool Finder</title>
      <meta
        name="description"
        content="Ask AI to find the best free online tools instantly."
      />

      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            AI Tool Assistant
          </h1>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Ask anything like image to pdf, background remover,
            image compressor and more.
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-zinc-900 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-zinc-800">

          <div className="flex flex-col md:flex-row gap-3">

            <input
              type="text"
              placeholder="Ask AI for any tool..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 px-5 py-4 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-black dark:text-white outline-none"
            />

            <button
              onClick={askAI}
              className="px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
            >
              Ask AI
            </button>

          </div>

          {loading && (
            <div className="mt-6 bg-white dark:bg-zinc-800 rounded-2xl p-5">
              <p className="text-gray-600 dark:text-gray-300">
                AI is thinking...
              </p>
            </div>
          )}

          {reply && (
            <div className="mt-6 bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-gray-200 dark:border-zinc-700">

              <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
                AI Response
              </h2>

              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-7">
                {reply}
              </p>

              {tool && (
                <div className="mt-6">

                  <div className="p-5 rounded-2xl bg-blue-50 dark:bg-zinc-900 border border-blue-100 dark:border-zinc-700">

                    <h3 className="text-xl font-bold text-black dark:text-white">
                      {tool.title}
                    </h3>

                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {tool.description}
                    </p>

                    <Link
                      to={tool.url}
                      className="inline-block mt-5 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
                    >
                      Open Tool
                    </Link>

                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}