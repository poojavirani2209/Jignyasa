import { LLMProvider, LLMMessage, LLMResponse } from "./provider";
import { HuggingFaceProvider } from "./huggingFace";
import { getLLMConfig } from "./config/llmconfig";

let provider: LLMProvider;

type AgentType = "domain" | "tutor";

export const initLLM = (agent: AgentType) => {
console.log("DOmain agen key"+process.env.DOMAIN_AGENT_API_KEY)
  const { apiKey, model } = getLLMConfig()[agent];
  provider = new HuggingFaceProvider(apiKey, model);
};

export async function callLLM(
  messages: LLMMessage[],
): Promise<LLMResponse> {
  if (!provider) throw new Error("LLM not initialized");
  return await provider.chat(messages);
}
