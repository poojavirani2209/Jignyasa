import { LLMMessage, LLMProvider, LLMResponse } from "../provider";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiProvider implements LLMProvider {
  private apiKey: string;
  private model: string;
  private genAI: GoogleGenerativeAI;
  private genAIModel: GenerativeModel;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.genAIModel = this.genAI.getGenerativeModel({ model });
  }

  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    let geminiMessages = convertToGeminiMessage(messages);
    const history = geminiMessages.slice(0, -1);
    const lastInput = geminiMessages[geminiMessages.length - 1];

    const currentChat = await this.genAIModel.startChat({
      history,
    });
    const geminiResponse = await currentChat.sendMessage(
      lastInput.parts[0].text
    );
    return { content: extractJSONFromMarkdown(geminiResponse.response.candidates[0].content.parts[0].text )};
  }

  async getModel() {
    return this.model;
  }
}

function extractJSONFromMarkdown(markdown: string): any | null {
  const match = markdown.match(/```json\s*([\s\S]*?)\s*```/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      console.error("Invalid JSON content:", e);
      return markdown;
    }
  }
  return markdown;
}

function convertToGeminiMessage(messages: LLMMessage[]): GeminiLLMMessage[] {
  return messages.map((message) => ({
    role: message.role == "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));
}

interface GeminiLLMMessage {
  role: string;
  parts: [{ text: string }];
}

function formatMessages(messages: { role: string; content: string }[]): string {
  return messages
    .map((m) =>
      m.role === "system"
        ? `System: ${m.content}`
        : m.role === "user"
        ? `User: ${m.content}`
        : `Assistant: ${m.content}`
    )
    .join("\n\n");
}
