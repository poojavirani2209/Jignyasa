import { Document } from "langchain/document";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { BaseLLM } from "@langchain/core/language_models/llms";
import * as FileReader from "../../../utils/fileReader";
import { RAGEngine } from "./ragEngine";
import { LLMMessage, LLMProvider } from "../../languageModels/provider";
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

  private async generateContext(contextDocs: Document[]): Promise<string> {
    const context = contextDocs.map((doc) => doc.pageContent).join("\n\n");
    return context;
  }

  async callWithRelevantContext(
    id: string,
    prompt: string,
    history?: LLMMessage[]
  ) {
    //TODO need to check how to handle relvancy with latest user message, chat history while getting relevant docs.
    const relevantDocs = await this.embedding.searchDocs(id, prompt);
    const context = await this.generateContext(relevantDocs);

    let messages: LLMMessage[] = [];
    if (history) {
      messages.push(...history);
    }

    messages.push({
      role: "user",
      content: `Use the following context to answer the question:\n\n Context:\n${context}\n\n  Question:\n${prompt}`,
    });

    const response = await this.provider.chat(messages);

    let responseMessages: LLMMessage[] = [];
    if (history) {
      responseMessages.push(...history);
    }
    responseMessages.push({role:"user",content:prompt})
    

    responseMessages.push({
      role: "assistant",
      content: response.content as string,
    });

    return responseMessages;
  }

  async callWithEntireContext(id: string, filePaths: string[], prompt: string) {
    const docs = await this.createVectorStore(id, filePaths);

    const context = await this.generateContext(docs);

    const response = await this.provider.chat([
      {
        role: "user",
        content: `Use the following context to answer the question:\n\n Context:\n${context}\n\n  Question:\n${prompt}`,
      },
    ]);

    return response;
  }

  async createVectorStore(id: string, filePaths: string[]) {
    const fullText = await FileReader.readTextFromFiles(filePaths);
    const docs = await this.chunkText(fullText);
    await this.embedding.createVectorStore(id, docs);
    return docs;
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
