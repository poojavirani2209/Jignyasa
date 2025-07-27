import { VLMMessage, VLMProvider, VLMResponse } from "../provider";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

export class GeminiVisionProvider implements VLMProvider {
  private apiKey: string;
  private model: string;
  private genAI: GoogleGenerativeAI;
  private genAIModel: GenerativeModel;

  constructor(apiKey: string, model: string = "gpt-4o") {
    this.apiKey = apiKey;
    this.model = model;
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.genAIModel = this.genAI.getGenerativeModel({ model });
  }

  async chat(messages: VLMMessage[]): Promise<VLMResponse> {
    let geminiMessages = convertToGeminiMessage(messages);

    const response = await this.genAIModel.generateContent(geminiMessages);
    return {
      content: response.response.text(),
    };
  }

  async getModel() {
    return this.model;
  }
}

function convertToGeminiMessage(messages: VLMMessage[]): any {
  return messages.map((message) => {
    const parts = [
      { text: message.content },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: getBase64Image(message.imagePath),
        },
      },
    ];

    return {
      role: message.role === "assistant" ? "model" : "user",
      parts,
    };
  });
}

function getBase64Image(imagePath: string) {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString("base64");
}

interface GeminiVLMMessage {
  role: string;
  parts: [{ text: string }, { inlineData: { mimeType: string; data: any } }];
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
