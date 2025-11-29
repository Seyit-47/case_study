export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface Model {
  id: string;
  name: string;
}

export interface Session {
  _id: string;
  modelId: string;
  title: string;
  createdAt: string;
}