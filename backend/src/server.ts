import dotenv from 'dotenv';
dotenv.config();

import express from 'express';  
import cors from 'cors';
import mongoose from 'mongoose';
import { initTelemetry } from './config/telemetry';
import * as ChatController from './controllers/ChatController';
  
initTelemetry();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.get('/models', ChatController.getModels);

app.post('/sessions', ChatController.createSession);
app.get('/sessions', ChatController.getSessions);

app.get('/sessions/:sessionId/messages', ChatController.getHistory);
app.post('/chat', ChatController.sendMessage);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chatdb';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('DB Connection Error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});