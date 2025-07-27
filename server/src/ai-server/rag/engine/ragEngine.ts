import { LLMMessage } from "../../languageModels/provider";

export interface RAGEngine {
  callWithRelevantContext(id: string, prompt: string, history?:LLMMessage[]);
  callWithEntireContext(id: string, filePaths: string[], prompt: string);
  createVectorStore(id:string, filePaths:string[]);
}
