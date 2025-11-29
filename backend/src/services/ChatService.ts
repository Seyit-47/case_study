import { ChatModel } from "../models/ChatModel";
import { SessionModel } from "../models/SessionModel";
import { OpenRouterService } from "./OpenRouterService";
import { getTracer } from "../config/telemetry";
import { trace, context } from '@opentelemetry/api';

const openRouterService = new OpenRouterService();
const tracer = getTracer('chat-service');

export class ChatService {
  
  async createSession(modelId: string) {
    const modelName = modelId.split('/')[1] || modelId;
    return await SessionModel.create({ 
      modelId, 
      title: `Chat with ${modelName}` 
    });
  }

  async getAllSessions() {
    return await SessionModel.find().sort({ createdAt: -1 });
  }

  async getHistory(sessionId: string) {
    return await ChatModel.find({ sessionId }).sort({ timestamp: 1 });
  }

  async processMessage(sessionId: string, message: string) {
    const span = tracer.startSpan('process_chat_transaction');
    
    try {
      const session = await SessionModel.findById(sessionId);
      if (!session) throw new Error("Session not found");

      await ChatModel.create({ sessionId, role: 'user', content: message });

      const activeContext = trace.setSpan(context.active(), span);
      const apiSpan = tracer.startSpan('openrouter_api_call', {}, activeContext);
      
      const aiResponse = await openRouterService.generateResponse(message, session.modelId);
      
      apiSpan.end();

      await ChatModel.create({ sessionId, role: 'assistant', content: aiResponse });

      return { reply: aiResponse };
    } catch (error) {
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  }

  getModels() {
    return openRouterService.getAvailableModels();
  }
}