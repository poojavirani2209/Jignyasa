export const getLLMConfig = () => ({
  domain: {
    apiKey: process.env.DOMAIN_AGENT_API_KEY!,
    model: "gemini-2.0-flash-lite",
  },
  tutor: {
    apiKey: process.env.DOMAIN_AGENT_API_KEY!,
    model: "HuggingFaceH4/zephyr-7b-beta",
  },
  analyzer: {
    apiKey: process.env.DOMAIN_AGENT_API_KEY!,
    model: "HuggingFaceH4/zephyr-7b-beta",//gpt4-0
  },
});
