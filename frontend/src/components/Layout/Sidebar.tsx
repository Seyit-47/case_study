import React from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import type { Session } from '../../types';

interface SidebarProps {
  sessions: Session[];
  selectedSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, selectedSessionId, onSelectSession, onNewChat 
}) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onNewChat}>
          <Plus size={20} /> New Chat
        </button>
      </div>

      <div className="session-list">
        <div className="session-label">History</div>
        {sessions.map(session => (
          <div 
            key={session._id}
            className={`session-item ${selectedSessionId === session._id ? 'active' : ''}`}
            onClick={() => onSelectSession(session._id)}
          >
            <MessageSquare size={18} />
            <span className="session-text">{session.title}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};