import { ChatModel } from "../models/ChatModel";
import { SessionModel } from "../models/SessionModel";
import { OpenRouterService } from "./OpenRouterService";
import { getTracer } from "../config/telemetry";
import { trace, context, SpanStatusCode, Span} from '@opentelemetry/api';

const openRouterService = new OpenRouterService();
const tracer = getTracer('chat-service');

export class ChatService {
  
  private async withDbSpan<T>(name: string, parentSpan: Span, operation: () => Promise<T>): Promise<T> {
    const ctx = trace.setSpan(context.active(), parentSpan);
    const span = tracer.startSpan(name, {}, ctx);
    try {
      const result = await operation();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (err) {
      span.recordException(err as Error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw err;
    } finally {
      span.end();
    }
  }

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
      span.setAttribute("app.session_id", sessionId);
      
      const session = await this.withDbSpan('mongo_find_session', span, async () => {
        return await SessionModel.findById(sessionId);
      });

      if (!session) throw new Error("Session not found");
      
      span.setAttribute("app.model_id", session.modelId);

      await this.withDbSpan('mongo_save_user_msg', span, async () => {
        await ChatModel.create({ sessionId, role: 'user', content: message });
      });

      const previousMessages = await this.withDbSpan('mongo_fetch_history', span, async () => {
        return await ChatModel.find({ sessionId }).sort({ timestamp: 1 });
      });

      const contextMessages = previousMessages.map(msg => ({
        role: msg.role as "user" | "assistant", 
        content: msg.content
      }));

      const ctx = trace.setSpan(context.active(), span);
      const apiSpan = tracer.startSpan('openrouter_api_call', {}, ctx);
      
      let aiResponse: string;
      try {
        aiResponse = await openRouterService.generateResponse(contextMessages, session.modelId);
        apiSpan.setAttribute("app.response_length", aiResponse.length);
        apiSpan.setStatus({ code: SpanStatusCode.OK });
      } 
      
      catch (apiError: any) { 
        apiSpan.recordException(apiError);
        apiSpan.setStatus({ code: SpanStatusCode.ERROR, message: apiError.message });

        if (apiError.status) {
            apiSpan.setAttribute("http.status_code", apiError.status);
        }
        if (apiError.code) {
            apiSpan.setAttribute("error.code", apiError.code);
        }
        if (apiError.type) {
            apiSpan.setAttribute("error.type", apiError.type);
        }

        apiSpan.addEvent("API Failure Details", {
            raw_error: JSON.stringify(apiError, null, 2)
        });

        apiSpan.end();
        throw apiError;
      } 
      finally {
        if (apiSpan.isRecording()) { 
             apiSpan.end(); 
        }
      }
      return { reply: aiResponse };
    } 
    
    catch (error) {
      span.recordException(error as Error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } 
    
    finally {
      span.end();
    }
  }

  getModels() {
    return openRouterService.getAvailableModels();
  }
}