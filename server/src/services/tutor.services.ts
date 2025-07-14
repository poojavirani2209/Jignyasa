import { LearningStyle } from "../types/profile";
import * as LLM from "../ai-server/llm";
import { LLMMessage } from "../ai-server/llm/provider";
import { Question } from "../types/chat";

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

    // let ragEngine = LLM.initRAG("tutor");

    // const result = await ragEngine.callWithRelevantContext(goalId, prompt);

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

export const createSubtopicQuiz = async (
  chatHistory: LLMMessage[],
  subTopicName: string,
  goalId: string,
  goal: string
) => {
  //TODO add articles/videos links.
  try {
    const prompt = `You're a smart and adaptive course tutor who understands how to create meaningful assessments for learners.

The user is studying the topic: **"${subTopicName}"** under the broader goal of learning "${goal}".

You have access to the following:
1. Chat history with the learner:
${chatHistory}

Based on this information, generate 5-7 multiple-choice questions that evaluate their understanding of the **"${subTopicName}"** topic. The questions should be based on actual concepts covered or discussed. Prefer conceptual and application-based questions rather than definitions.

Format the output as **valid JSON only**, like:

[
  {
 "id": "q1",
        "question": "What is the event loop?",
        "options": [
          "A loop in JS",
          "It processes async events",
          "Stack overflow",
          "A timer",
        ],
        "correctAnswerOption": 1},
  {
         "id": "q1",
        "question": "Which part of Node.js handles the callback queue?",
       options": ["Thread Pool", "Event Loop", "Call Stack", "Heap"],
        "correctAnswerOption": 2
  }
]

Only return valid JSON. Do not include explanations or additional text.

`;

    // let ragEngine = LLM.initRAG("tutor");

    // const result = await ragEngine.callWithRelevantContext(goalId, prompt);

    const content: Question[] = [
      {
        id: "q1",
        question: "What is the event loop?",
        options: [
          "A loop in JS",
          "It processes async events",
          "Stack overflow",
          "A timer",
        ],
        correctAnswerOption: 1,
      },
      {
        id: "q2",
        question: "Which part of Node.js handles the callback queue?",
        options: ["Thread Pool", "Event Loop", "Call Stack", "Heap"],
        correctAnswerOption: 2,
      },
    ];
    let response = { content };

    try {
      console.log("LLM Response" + JSON.stringify(response.content));
      return response.content;
    } catch (err) {
      console.error("Failed to parse questions JSON:", response.content);
      throw new Error("Invalid LLM response");
    }
  } catch (error) {
    console.error("Failed to create pre knowledge questionarrie", error);
    throw error;
  }
};
