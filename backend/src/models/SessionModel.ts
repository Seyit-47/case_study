import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  modelId: string;
  title: string;
  createdAt: Date;
}

const SessionSchema: Schema = new Schema({
  modelId: { type: String, required: true },
  title: { type: String, default: 'New Chat' },
  createdAt: { type: Date, default: Date.now }
});

export const SessionModel = mongoose.model<ISession>('Session', SessionSchema);