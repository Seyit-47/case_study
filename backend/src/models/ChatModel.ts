import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  sessionId: mongoose.Types.ObjectId;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatSchema: Schema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true, index: true },
  role: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const ChatModel = mongoose.model<IChat>('Chat', ChatSchema);