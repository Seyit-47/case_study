import { useState, useEffect } from 'react';
import { chatApi } from '../services/api';
import type { Message, Model, Session } from '../types';

export const useChat = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const [m, s] = await Promise.all([
          chatApi.getModels(), 
          chatApi.getSessions()
        ]);
        setModels(m);
        setSessions(s);
      } catch (err) {
        console.error("Initialization failed:", err);
        setModels([]); 
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!selectedSessionId) {
      setMessages([]);
      return;
    }

    const loadHistory = async () => {
      setLoading(true);
      try {
        const msgs = await chatApi.getHistory(selectedSessionId);
        setMessages(msgs);
      } catch (e) {
        console.error("Failed to load history", e);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, [selectedSessionId]);

  const createSession = async (modelId: string) => {
    try {
      const newSession = await chatApi.createSession(modelId);
      setSessions([newSession, ...sessions]); 
      setSelectedSessionId(newSession._id);
    } catch (e) {
      alert("Failed to create chat. Is backend running?");
    }
  };

  const sendMessage = async (input: string) => {
    if (!input.trim() || !selectedSessionId) return;
    
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await chatApi.sendMessage(selectedSessionId, input);
      const botMsg: Message = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      alert("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return { 
    models, sessions, selectedSessionId, messages, loading, error,
    createSession, setSelectedSessionId, sendMessage 
  };
};