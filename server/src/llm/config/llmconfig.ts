export const getLLMConfig = () => ({
  domain: {
    apiKey: process.env.DOMAIN_AGENT_API_KEY!,
    model: "HuggingFaceH4/zephyr-7b-beta",
  },
});