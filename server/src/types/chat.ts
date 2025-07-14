import { LLMMessage } from "../ai-server/llm/provider";

export interface ChatHistoryMetaData {
  id: string;
  userId: string;
  goalId: string;
  subTopicName: string;
  messages: LLMMessage[];
  lastUpdatedAt: Date;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswerOption: number;
}

export interface QuizPerformance {
  questions: Question[];
  answers: string[];
}
