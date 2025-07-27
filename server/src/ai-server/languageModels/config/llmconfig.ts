export const getLLMConfig = () => ({
  domain: {
    apiKey: process.env.DOMAIN_AGENT_API_KEY!,
    model: "gemini-2.0-flash-lite",
  },
  tutor: {
    apiKey: process.env.DOMAIN_AGENT_API_KEY!,
    model: "gemini-2.0-flash-lite",
  },
  analyzer: {
    apiKey: process.env.DOMAIN_AGENT_API_KEY!,
    model: "gemini-2.0-flash-lite",
  },
});
