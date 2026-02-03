import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';
import { Message } from './types';
import { sendMessageStream, resetSession } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting function
  const setInitialGreeting = () => {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: 'bot',
        content: "Namaste! I am Dr. Bhavna. Just feel free to ask us about your sufferings. Aap apni problem Hindi ya English dono me bata sakte hain.",
        timestamp: Date.now(),
      },
    ]);
  };

  // Initial load
  useEffect(() => {
    if (!hasInitialized.current) {
      resetSession();
      setInitialGreeting();
      hasInitialized.current = true;
    }
  }, []);

  const handleReset = () => {
    resetSession();
    setInitialGreeting();
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Create a placeholder bot message for streaming
      const botMessageId = crypto.randomUUID();
      const botMessage: Message = {
        id: botMessageId,
        role: 'bot',
        content: '',
        timestamp: Date.now(),
      };
      
      setMessages((prev) => [...prev, botMessage]);

      let accumulatedContent = '';

      await sendMessageStream(text, (chunk) => {
        accumulatedContent += chunk;
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === botMessageId 
              ? { ...msg, content: accumulatedContent } 
              : msg
          )
        );
      });

    } catch (error) {
      console.error(error);
      // Remove the empty bot message if it failed immediately or append error
      setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg.role === 'bot' && lastMsg.content === '') {
             return prev.slice(0, -1);
          }
          return prev;
      });
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-2xl overflow-hidden md:rounded-xl md:my-4 md:h-[95vh] border border-gray-200">
      <Header onReset={handleReset} />
      
      <main className="flex-1 overflow-y-auto p-4 bg-[#eef4fb] scrollbar-hide">
        <div className="space-y-2">
            {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
             <div className="flex items-center space-x-2 p-4 bg-white rounded-2xl w-fit border border-gray-100">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
             </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </main>

      <InputArea onSend={handleSendMessage} isLoading={isLoading} />
      
      <div className="bg-gray-50 p-2 text-center text-[11px] text-gray-500 border-t border-gray-200">
        Disclaimer: For a detailed evaluation and precise dosage, please consult Dr. Bhavna physically. <br/>
        Email: <a href="mailto:drbhavnabamania@gmail.com" className="text-blue-600 hover:underline">drbhavnabamania@gmail.com</a>
      </div>
    </div>
  );
};

export default App;