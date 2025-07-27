import { LearningPath } from "../../types/goal";

export type LLMRole = "system" | "user" | "assistant";

export interface LLMMessage {
  role: LLMRole;
  content: string;
}

export interface VLMMessage extends LLMMessage {
  imagePath: string;
}

export interface LLMResponse {
  content: LearningPath | string;
}

export interface VLMResponse {
  content: any;
}

export interface LLMProvider {
  chat(messages: LLMMessage[]): Promise<LLMResponse>;
}

export interface VLMProvider {
  chat(messages: VLMMessage[]): Promise<VLMResponse>;
}
