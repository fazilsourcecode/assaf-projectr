import React from 'react';
import { Message } from '../types';
import { getEmotionColor, getEmotionIcon } from '../utils/emotionAnalysis';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex items-start gap-3 mb-4 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isBot 
          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
          : 'bg-gradient-to-br from-green-500 to-teal-600 text-white'
      }`}>
        {isBot ? <Bot size={16} /> : <User size={16} />}
      </div>
      
      <div className={`max-w-[80%] ${isBot ? 'text-left' : 'text-right'}`}>
        <div className={`inline-block px-4 py-2 rounded-2xl shadow-sm ${
          isBot 
            ? 'bg-white text-gray-800 rounded-bl-sm' 
            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-sm'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        </div>
        
        <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${
          isBot ? 'justify-start' : 'justify-end'
        }`}>
          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {message.emotion && !isBot && (
            <div className="flex items-center gap-1">
              <span>{getEmotionIcon(message.emotion.primary)}</span>
              <span className="capitalize" style={{ color: getEmotionColor(message.emotion.primary) }}>
                {message.emotion.primary}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}