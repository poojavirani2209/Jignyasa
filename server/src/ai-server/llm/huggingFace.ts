import axios from "axios";
import { LLMMessage, LLMProvider, LLMResponse } from "./provider";

export class HuggingFaceProvider implements LLMProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    const res = await axios.post(
      `https://api-inference.huggingface.co/models/${this.model}`,
      {
        inputs: formatMessages(messages),
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );

    const content = res.data?.[0]?.generated_text;
    return { content };
  }

  async getModel() {
    return this.model;
  }
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
