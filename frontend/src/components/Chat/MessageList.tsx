import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
    <>
      {messages.map((msg, index) => (
        <div key={index} className={`message-row ${msg.role}`}>
          <div className="avatar-text">
            {msg.role === 'assistant' ? 'AI' : 'Me'}
          </div>
          
          <div className="bubble">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, inline, className, children, ...props}: any) {
                  return !inline ? (
                    <div style={{background: '#1e1e1e', color: '#fff', padding: '10px', borderRadius: '5px', overflowX: 'auto'}}>
                      <code {...props}>{children}</code>
                    </div>
                  ) : (
                    <code style={{background: 'rgba(0,0,0,0.1)', padding: '2px 4px', borderRadius: '3px'}} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
      
      {loading && (
        <div className="message-row assistant">
          <div className="avatar-text">AI</div>
          <div className="bubble" style={{fontStyle:'italic', color:'#6b7280'}}>Thinking...</div>
        </div>
      )}
      <div ref={bottomRef} />
    </>
  );
};