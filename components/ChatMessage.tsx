import React from 'react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === 'bot';

  return (
    <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className="flex-shrink-0 mx-2">
          {isBot ? (
            <img 
              src="https://bamgouri5-a11y.github.io/Homeopathy-Bot/doctor.jpg" 
              alt="Bot" 
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              YOU
            </div>
          )}
        </div>

        {/* Bubble */}
        <div 
          className={`
            relative px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
            ${isBot 
              ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-none' 
              : 'bg-blue-600 text-white rounded-tr-none'
            }
          `}
        >
          {isBot ? (
            <div className="markdown-body">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ) : (
            <span>{message.content}</span>
          )}
          
          <div className={`text-[10px] mt-1 opacity-60 ${isBot ? 'text-gray-400' : 'text-blue-200 text-right'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;