import { OpenAI } from "openai";
import { getTracer } from "../config/telemetry";

const tracer = getTracer('openrouter-service');

export class OpenRouterService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.warn("OPENROUTER_API_KEY is missing");
    }

    this.openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey, 
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "Madlen Chat",
      }
    });
  }

  async generateResponse(messages: any[], model: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: model,
        messages: messages,
      });
      return completion.choices[0].message.content || "No response from AI...";
    } catch (error) {
      console.error("OpenRouter API Error:", error);
      throw error;
    }
  }

  // We can add more models here.
  getAvailableModels() {
    return [
      { id: "openai/gpt-oss-20b:free", name: "GPT OSS 20B (Free)" },
      { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash (Free)" },
      { id: "moonshotai/kimi-k2:free", name: "Moonshot Kimi K2 (Free)" },
      { id: "google/gemma-3n-e2b-it:free", name: "Google Gemma 3n (Free)" },
      { id: "tngtech/deepseek-r1t2-chimera:free", name: "DeepSeek R1 Chimera (Free)" },
      { id: "meta-llama/llama-3.2-3b-instruct:free", name: "Llama 3.2 3B (Free)" },
    ];
  }
}