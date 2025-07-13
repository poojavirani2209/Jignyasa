export interface RAGEngine {
  callWithRelevantContext(id: string, prompt: string): Promise<string>;
  callWithEntireContext(
    id: string,
    filePaths: string[],
    prompt: string
  ): Promise<string>;
}
