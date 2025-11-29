import React, { useEffect, useRef } from 'react';
import { User, Bot } from 'lucide-react';
import type { Message } from '../../types';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, loading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="chat-container">
      {messages.map((msg, index) => (
        <div key={index} className={`message-row ${msg.role}`}>
          {msg.role === 'assistant' && <div className="avatar bot"><Bot size={20}/></div>}
          
          <div className="bubble">
            {msg.content}
          </div>

          {msg.role === 'user' && <div className="avatar user"><User size={20}/></div>}
        </div>
      ))}
      
      {loading && (
        <div className="message-row assistant">
          <div className="avatar bot"><Bot size={20}/></div>
          <div className="bubble loading-indicator">Thinking...</div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};