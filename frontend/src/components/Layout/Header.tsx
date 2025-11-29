import React from 'react';
import { Bot, Cpu } from 'lucide-react';
import type { Model } from '../../types';

interface HeaderProps {
  models: Model[];
  selectedModel: string;
  onModelChange: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ models, selectedModel, onModelChange }) => {
  return (
    <header className="app-header">
      <div className="logo-section">
        <Bot size={28} className="logo-icon" />
        <h1>Madlen Chat</h1>
      </div>
      
      <div className="controls-section">
        <Cpu size={18} />
        <select 
          value={selectedModel} 
          onChange={(e) => onModelChange(e.target.value)}
          className="model-select"
        >
          {models.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>
    </header>
  );
};