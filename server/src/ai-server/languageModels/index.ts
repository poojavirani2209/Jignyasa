import { LLMProvider, LLMMessage, LLMResponse, VLMProvider } from "./provider";
import { getLLMConfig } from "./config/llmconfig";
import { LangChainEmbeddingProvider } from "../rag/embedding/langChainEmbeddingProvider";
import { VectorEmbeddingProvider } from "../rag/embedding/provider";
import { langChainRAGEngine } from "../rag/engine/langChainRAGEngine";
// import { OpenAIVisionProvider } from "./vlm/openAIVision";
import { GeminiProvider } from "./llm/gemini";
import { RAGEngine } from "../rag/engine/ragEngine";
import { GeminiVisionProvider } from "./vlm/geminiAIVision";

let ragEngine: RAGEngine;
let provider: LLMProvider | VLMProvider;
let embedding: VectorEmbeddingProvider;

export const initLLM = (agent: AgentType) => {
  const { apiKey, model } = getLLMConfig()[agent];
  provider = new GeminiProvider(apiKey, model);
  return provider as LLMProvider;
};

export const initVLM = (agent: AgentType) => {
  const { apiKey, model } = getLLMConfig()[agent];
  provider = new GeminiVisionProvider(apiKey, model);
  return provider as VLMProvider;
};

export const initRAG = (agent: AgentType) => {
  const { apiKey, model } = getLLMConfig()[agent];
  provider = new GeminiProvider(apiKey, model);
  embedding = new LangChainEmbeddingProvider(apiKey);
  ragEngine = new langChainRAGEngine(embedding, provider as LLMProvider);
  return ragEngine;
};

export const getRAGEngine = (agent: AgentType) => {
  if (!ragEngine) {
    return initRAG(agent);
  }
  return ragEngine;
};

export async function callLLM(messages: LLMMessage[]): Promise<LLMResponse> {
  if (!provider) throw new Error("LLM not initialized");
  return await (provider as LLMProvider).chat(messages);
}
