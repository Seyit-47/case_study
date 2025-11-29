import { useState } from 'react';
import { useChat } from './hooks/useChat';
import { Sidebar } from './components/Layout/Sidebar';
import { MessageList } from './components/Chat/MessageList';

function App() {
  const { 
    models, sessions, selectedSessionId, messages, loading, 
    createSession, setSelectedSessionId, sendMessage 
  } = useChat();
  
  const [input, setInput] = useState('');

  const handleSend = () => {
    sendMessage(input);
    setInput('');
  };

  const currentSession = sessions.find(s => s._id === selectedSessionId);

  return (
    <div className="app-layout">
      
      <Sidebar 
        sessions={sessions} 
        selectedSessionId={selectedSessionId}
        onSelectSession={setSelectedSessionId}
        onNewChat={() => setSelectedSessionId(null)}
      />

      <main className="main-chat">
        
        {selectedSessionId ? (
          <>
            <header className="chat-header">
              <h3>{currentSession?.title || 'Chat'}</h3>
              <small>Powered by OpenRouter</small>
            </header>

            <div className="chat-content">
              <MessageList messages={messages} loading={loading} />
            </div>

            <div className="input-area">
              <div className="input-wrapper">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  disabled={loading}
                  autoFocus
                />
                <button 
                  className="send-btn" 
                  onClick={handleSend} 
                  disabled={loading || !input.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          </>

        ) : (
          
          <div className="dashboard-container">
            <h1 className="welcome-title">Madlen Chat</h1>
            
            <div className="models-grid">
              {models.length > 0 ? (
                models.map(model => (
                  <div 
                    key={model.id} 
                    className="model-card"
                    onClick={() => createSession(model.id)}
                  >
                    <div className="model-name">{model.name}</div>
                    <div className="model-desc">Click to start conversation</div>
                  </div>
                ))
              ) : (
                <div className="error-box">
                  <strong>Connection Error</strong>
                  <p style={{marginTop:'10px', fontSize:'0.9rem'}}>
                    Backend connection error?
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;