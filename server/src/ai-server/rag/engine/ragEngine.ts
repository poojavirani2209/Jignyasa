export interface RAGEngine {
  callWithRelevantContext(id: string, prompt: string);
  callWithEntireContext(id: string, filePaths: string[], prompt: string);
}
