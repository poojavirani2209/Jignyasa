import { LLMProvider, LLMMessage, LLMResponse, VLMProvider } from "./provider";
import { HuggingFaceProvider } from "./huggingFace";
import { getLLMConfig } from "./config/llmconfig";
import { LangChainEmbeddingProvider } from "../rag/embedding/langChainEmbeddingProvider";
import { VectorEmbeddingProvider } from "../rag/embedding/provider";
import { langChainRAGEngine } from "../rag/engine/langChainRAGEngine";
import { OpenAIVisionProvider } from "./openAIVision";

let provider: LLMProvider | VLMProvider;
let embedding: VectorEmbeddingProvider;

export const initLLM = (agent: AgentType) => {
  const { apiKey, model } = getLLMConfig()[agent];
  provider = new HuggingFaceProvider(apiKey, model);
  return provider;
};

export const initVLM = (agent: AgentType) => {
  const { apiKey, model } = getLLMConfig()[agent];
  provider = new OpenAIVisionProvider(apiKey, model);
  return provider;
};

export const initRAG = (agent: AgentType) => {
  const { apiKey, model } = getLLMConfig()[agent];
  provider = new HuggingFaceProvider(apiKey, model);
  embedding = new LangChainEmbeddingProvider(apiKey);
  return new langChainRAGEngine(embedding, provider as LLMProvider);
};

export async function callLLM(messages: LLMMessage[]): Promise<LLMResponse> {
  if (!provider) throw new Error("LLM not initialized");
  return await (provider as LLMProvider).chat(messages);
}
