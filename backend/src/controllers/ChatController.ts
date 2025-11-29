import { Request, Response } from 'express';
import { ChatService } from '../services/ChatService';

const chatService = new ChatService();

export const getModels = (req: Request, res: Response) => {
  const models = chatService.getModels();
  res.json(models);
};

export const createSession = async (req: Request, res: Response) => {
  try {
    const { modelId } = req.body;
    if (!modelId) {
      return res.status(400).json({ error: 'modelId is required' });
    }
    const session = await chatService.createSession(modelId);
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
};

export const getSessions = async (req: Request, res: Response) => {
  try {
    const sessions = await chatService.getAllSessions();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const history = await chatService.getHistory(sessionId);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
      return res.status(400).json({ error: 'sessionId and message are required' });
    }
    const result = await chatService.processMessage(sessionId, message);
    res.json(result);
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: 'Failed to process message' });
  }
};