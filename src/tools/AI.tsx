import { useEffect, useRef, useState } from 'react';
import {
  Send,
  Sparkles,
  Mic,
  Square,
  Volume2
} from 'lucide-react';

export default function AI() {

  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);

  const [listening, setListening] = useState(false);

  const [speaking, setSpeaking] = useState(false);

  const [messages, setMessages] = useState<any[]>(([
    {
      role: 'assistant',
      text: `Hello 👋
How can I help you today?`
    }
  ]));

  const bottomRef = useRef<any>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: 'smooth'
    });

  }, [messages]);

  // Voice Recognition
  const startListening = () => {

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {

      alert('Voice recognition not supported.');

      return;

    }

    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event: any) => {

      const transcript =
        event.results[0][0].transcript;

      setMessage(transcript);

    };

    recognition.start();

    recognitionRef.current = recognition;

  };

  const stopListening = () => {

    recognitionRef.current?.stop();

    setListening(false);

  };

  // Speak AI response
  const speakText = (text: string) => {

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.rate = 1;

    utterance.pitch = 1;

    utterance.onstart = () => {
      setSpeaking(true);
    };

    utterance.onend = () => {
      setSpeaking(false);
    };

    speechSynthesis.speak(utterance);

  };

  const stopSpeaking = () => {

    speechSynthesis.cancel();

    setSpeaking(false);

  };

  const sendMessage = async () => {

    if (!message.trim()) return;

    const currentMessage = message;

    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        text: currentMessage
      }
    ]);

    setMessage('');

    setLoading(true);

    try {

      const response = await fetch('/api/ai', {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({

          messages: [
            ...messages.slice(-12),
            {
              role: 'user',
              text: currentMessage
            }
          ]

        })

      });

      const data = await response.json();

      const aiReply =
        data.reply || 'Please try again.';

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: aiReply
        }
      ]);

      speakText(aiReply);

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

  const handleKeyDown = (e: any) => {

    if (e.key === 'Enter' && !e.shiftKey) {

      e.preventDefault();

      sendMessage();

    }

  };

  return (

    <div className="h-screen bg-white dark:bg-black flex flex-col">

      {/* Header */}
      <div className="border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-black sticky top-0 z-50">

        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">

              <Sparkles className="text-white w-5 h-5" />

            </div>

            <div>

              <h1 className="font-bold text-gray-900 dark:text-white text-lg">
                AI Assistant
              </h1>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Smart AI Assistant
              </p>

            </div>

          </div>

          {speaking && (

            <button
              onClick={stopSpeaking}
              className="text-red-500"
            >

              <Square className="w-5 h-5" />

            </button>

          )}

        </div>

      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto">

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

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
                className={`max-w-[85%] rounded-3xl px-5 py-4 whitespace-pre-wrap leading-7 text-[15px] shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white'
                }`}
              >

                {msg.text}

                {msg.role === 'assistant' && (

                  <button
                    onClick={() => speakText(msg.text)}
                    className="mt-3 opacity-70 hover:opacity-100"
                  >

                    <Volume2 className="w-4 h-4" />

                  </button>

                )}

              </div>

            </div>

          ))}

          {loading && (

            <div className="flex justify-start">

              <div className="bg-gray-100 dark:bg-zinc-900 px-5 py-4 rounded-3xl text-gray-700 dark:text-gray-300 animate-pulse">

                Thinking...

              </div>

            </div>

          )}

          <div ref={bottomRef}></div>

        </div>

      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-black">

        <div className="max-w-4xl mx-auto p-4">

          <div className="flex items-end gap-3 bg-gray-100 dark:bg-zinc-900 rounded-3xl px-4 py-3 border border-gray-200 dark:border-zinc-800">

            <textarea
              placeholder="Message AI Assistant..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              className="flex-1 bg-transparent resize-none outline-none text-gray-900 dark:text-white max-h-40 min-h-[48px] text-[15px]"
            />

            {listening ? (

              <button
                onClick={stopListening}
                className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center"
              >

                <Square className="w-5 h-5" />

              </button>

            ) : (

              <button
                onClick={startListening}
                className="w-12 h-12 rounded-2xl bg-gray-300 dark:bg-zinc-700 flex items-center justify-center"
              >

                <Mic className="w-5 h-5" />

              </button>

            )}

            <button
              onClick={sendMessage}
              disabled={loading}
              className="w-12 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center text-white shrink-0 disabled:opacity-50"
            >

              <Send className="w-5 h-5" />

            </button>

          </div>

        </div>

      </div>

    </div>

  );
}