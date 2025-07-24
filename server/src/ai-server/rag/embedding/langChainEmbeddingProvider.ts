import { VectorEmbeddingProvider } from "./provider";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";

export class LangChainEmbeddingProvider implements VectorEmbeddingProvider {
  private stores: Map<string, MemoryVectorStore> = new Map();

  private embedding: HuggingFaceTransformersEmbeddings; //TODO baseembedding.

  constructor(apiKey: string) {
    this.embedding = new HuggingFaceTransformersEmbeddings({
      modelName: "Xenova/all-MiniLM-L6-v2",
    });
  }

  async embed(texts: string[]): Promise<number[][]> {
    return this.embedding.embedDocuments(texts);
  }

  async createVectorStore(id: string, docs: Document[]): Promise<void> {
    let vectorStore = await MemoryVectorStore.fromDocuments(
      docs,
      this.embedding
    );
    this.stores.set(id, vectorStore);
  }

  async searchDocs(id: string, query: string, topK = 3): Promise<Document[]> {
    if (!this.stores.get(id)) {
      throw new Error(
        "Vector store not initialized. Call createVectorStore first."
      );
    }
    return this.stores.get(id).similaritySearch(query, topK);
  }
}
