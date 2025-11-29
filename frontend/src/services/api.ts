import axios from 'axios';
import type { Message, Model, Session } from '../types';

const API = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatApi = {
  getModels: async () => {
    const res = await API.get<Model[]>('/models');
    return res.data;
  },

  createSession: async (modelId: string) => {
    const res = await API.post<Session>('/sessions', { modelId });
    return res.data;
  },
  
  getSessions: async () => {
    const res = await API.get<Session[]>('/sessions');
    return res.data;
  },

  getHistory: async (sessionId: string) => {
    const res = await API.get<Message[]>(`/sessions/${sessionId}/messages`);
    return res.data;
  },

  sendMessage: async (sessionId: string, message: string) => {
    const res = await API.post<{ reply: string }>('/chat', { sessionId, message });
    return res.data;
  }
};