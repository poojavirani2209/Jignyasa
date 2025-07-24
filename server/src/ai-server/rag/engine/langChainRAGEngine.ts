import { Document } from "langchain/document";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { BaseLLM } from "@langchain/core/language_models/llms";
import * as FileReader from "../../../utils/fileReader";
import { RAGEngine } from "./ragEngine";
import { LLMProvider } from "../../llm/provider";
import { VectorEmbeddingProvider } from "../embedding/provider";

export class langChainRAGEngine implements RAGEngine {
  private baseLLM: BaseLLM;

  constructor(
    private embedding: VectorEmbeddingProvider,
    private provider: LLMProvider
  ) {
    this.baseLLM = new LangChainLLMAdapter(this.provider) as unknown as BaseLLM;
  }

  private async chunkText(text: string): Promise<Document[]> {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    return splitter.createDocuments([text]);
  }

  private async summarizeDocs(docs: Document[]) {
    const chain = await loadSummarizationChain(this.baseLLM, {
      type: "map_reduce",
    });
    return await chain.run(docs);
  }

  private async generateFinalPrompt(
    userPrompt: string,
    contextDocs: Document[]
  ): Promise<string> {
    const context = contextDocs.map((doc) => doc.pageContent).join("\n\n");
    return `
Use the following context to answer the question:

Context:
${context}

Question:
${userPrompt}
    `.trim();
  }

  async callWithRelevantContext(id: string, prompt: string) {
    //TODO need to check how to handle relvancy with latest user message, chat history while getting relevant docs.
    const relevantDocs = await this.embedding.searchDocs(id, prompt);
    const finalPrompt = await this.generateFinalPrompt(prompt, relevantDocs);

    // const response = await this.provider.chat([
    //   { role: "user", content: finalPrompt },
    // ]);

    // return response;
  }

  async callWithEntireContext(id: string, filePaths: string[], prompt: string) {
    const fullText = await FileReader.readTextFromFiles(filePaths);
    const docs = await this.chunkText(fullText);
    await this.embedding.createVectorStore(id, docs);
    // const finalPrompt = await this.generateFinalPrompt(prompt, docs);

    // const response = await this.provider.chat([
    //   { role: "user", content: finalPrompt },
    // ]);

    // return response;
  }
}

class LangChainLLMAdapter {
  constructor(private readonly provider: LLMProvider) {}

  _llmType(): string {
    return "custom-llm";
  }

  async _call(prompt: string): Promise<string> {
    const res = await this.provider.chat([{ role: "user", content: prompt }]);
    return typeof res.content === "string"
      ? res.content
      : JSON.stringify(res.content);
  }
}
