import { LearningStyle } from "../types/profile";
import * as LLM from "../ai-server/llm";
import { LLMMessage } from "../ai-server/llm/provider";

export const startTutoring = async (
  goalId: string,
  subTopicName: string,
  learningStyle: LearningStyle
) => {
  try {
    const prompt = `
You're a personal tutor Teach the following topic clearly and interactively in layman terms.

Topic to teach: "${subTopicName}"
Preferred learning style: ${learningStyle}
`;
    // LLM.initLLM("tutor");

    // const response = await LLM.callLLM([
    //   { role: "system", content: "You are a helpful learning assistant." },
    //   { role: "user", content: prompt },
    // ]);

    let ragEngine = LLM.initRAG("tutor");

    const result = await ragEngine.callWithRelevantContext(goalId, prompt);

    const response = {
      content: "Sure lets get started with the subtopic.",
    };
    try {
      const messages: LLMMessage[] = [
        { role: "assistant", content: response.content as string },
      ];
      return messages;
    } catch (err) {
      console.error("Failed to parse tutor response:", response.content);
      throw new Error("Invalid LLM response");
    }
  } catch (error) {
    console.error("Failed to initiate tutoring session", error);
    throw error;
  }
};

export const continueTutoring = async (messages: LLMMessage[]) => {
  try {
    // LLM.initLLM("tutor");
    // const response = await LLM.callLLM(messages);
    const response = {
      content: "Lets clear out this with an example.",
    };
    try {
      const newMessages: LLMMessage[] = [
        ...messages,
        { role: "assistant", content: response.content as string },
      ];
      return newMessages;
    } catch (err) {
      console.error("Failed to parse tutor response:", response.content);
      throw new Error("Invalid LLM response");
    }
  } catch (error) {
    console.error("Failed to continue tutoring session", error);
    throw error;
  }
};
