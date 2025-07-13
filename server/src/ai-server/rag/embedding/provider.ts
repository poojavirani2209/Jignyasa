export interface VectorEmbeddingProvider {
  embed(texts: string[]): Promise<number[][]>;
  createVectorStore(id:string, docs: any[]): Promise<any>;
  searchDocs(id:string, query: string, topK?: number): Promise<any[]>;
}
