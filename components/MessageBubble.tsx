import React from 'react';
import { Message, Role } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { User, Bot, AlertCircle } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`w-full py-6 animate-fade-in-up ${
      isUser ? 'bg-transparent' : 'bg-[#0f1014]/40 border-y border-white/5 backdrop-blur-[2px]'
    }`}>
      <div className="max-w-4xl mx-auto px-4 md:px-6 flex gap-5 md:gap-8">
        
        {/* Avatar */}
        <div className="flex-shrink-0 flex flex-col relative mt-1">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg ${
            isUser 
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20' 
              : 'bg-black border border-white/10'
          }`}>
            {isUser ? (
              <User className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-indigo-400" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-hidden min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-sm font-bold tracking-wide ${isUser ? 'text-gray-200' : 'text-indigo-300'}`}>
              {isUser ? 'You' : 'KTR Bot'}
            </span>
            <span className="text-[10px] text-gray-600 ml-auto font-mono">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {message.error ? (
            <div className="flex items-center gap-3 text-red-300 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">Error generating response. Please try again.</p>
            </div>
          ) : (
            <div className={`text-[15px] leading-relaxed font-light tracking-wide ${
              isUser 
                ? 'text-white bg-gradient-to-br from-[#2a2b36] to-[#1a1b22] border border-white/10 p-4 rounded-2xl rounded-tl-none shadow-xl inline-block' 
                : 'text-gray-300'
            } ${message.isStreaming ? 'typing-cursor' : ''}`}>
              <MarkdownRenderer content={message.content} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;