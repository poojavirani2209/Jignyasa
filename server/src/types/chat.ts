import { LLMMessage } from "../ai-server/llm/provider";

export interface ChatHistoryMetaData {
  id: string;
  userId: string;
  goalId: string;
  subTopicName: string;
  messages: LLMMessage[];
  lastUpdatedAt: Date;
}
