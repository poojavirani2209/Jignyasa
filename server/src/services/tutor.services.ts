import { LearningStyle } from "../types/profile";
import { LLMMessage } from "../ai-server/llm/provider";
import { Question } from "../types/chat";
import * as LLM from "../ai-server/llm";

export const startTutoring = async (
  goalId: string,
  subTopicName: string,
  userDeclaredlearningStyle: LearningStyle,
  adaptiveLearningStyle: LearningStyle
) => {
  try {
    const prompt = `
You are an expert personal tutor. Your task is to teach the following topic in a clear, engaging, and interactive manner, using layman’s terms:

Topic: ${subTopicName}
Preferred learning style: ${userDeclaredlearningStyle}
Analyzed (adaptive) learning style: ${adaptiveLearningStyle}

Your goals:

Adapt your teaching method primarily to the analyzed learning style, while still respecting the user-declared preference.

Make the session engaging, interactive, and easy to follow—use analogies, examples, and questions where appropriate.

Ensure the learner remains productive and interested throughout the session.

Continuously check for understanding and adjust explanations as needed.

Encourage the learner to apply or reflect on the concept in a simple way.

Begin by point outlining what will be covered, and ask user if we can start the session.
`;

    let ragEngine = LLM.getRAGEngine("domain");

    let response = await ragEngine.callWithRelevantContext(goalId, prompt);

    response = {
      content: `Okay, let's dive into the fascinating world of the Node.js Event Loop! I understand you prefer a visual learning style, but since you also analyze as being an auditory learner, I'll make sure the explanations are clear and concise and that you can follow along!

Here's what we'll cover today:

*   **What is the Event Loop?** (The core concept!)
*   **Why is it important?** (Benefits and how it makes Node.js fast)
*   **How it works (Simplified)** (Step-by-step breakdown)
*   **Sync vs. Async code (Quick Refresher)** (Making sure you understand the difference)
*   **The different phases of the Event Loop (Simplified)** (See how the Event Loop handles different tasks)
*   **Worker Pool and the Event Loop (Simplified)** (Letting you know that the Event Loop does not handle every task and what tasks it handles)
*   **A Quick Example** (See how the Event Loop works in practice)

How does that sound? Ready to get started?`,
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

export const continueTutoring = async (
  goalId: string,
  messages: LLMMessage[]
) => {
  try {
    let ragEngine = LLM.initRAG("domain");
    const lastInput = messages[messages.length - 1];

    let response = await ragEngine.callWithRelevantContext(
      goalId,
      lastInput.content
    );
    response = {
      content: `Okay, let's dive into the fascinating world of the Node.js Event Loop! I understand you prefer a visual learning style, but since you also analyze as being an auditory learner, I'll make sure the explanations are clear and concise and that you can follow along!

Here's what we'll cover today:

*   **What is the Event Loop?** (The core concept!)
*   **Why is it important?** (Benefits and how it makes Node.js fast)
*   **How it works (Simplified)** (Step-by-step breakdown)
*   **Sync vs. Async code (Quick Refresher)** (Making sure you understand the difference)
*   **The different phases of the Event Loop (Simplified)** (See how the Event Loop handles different tasks)
*   **Worker Pool and the Event Loop (Simplified)** (Letting you know that the Event Loop does not handle every task and what tasks it handles)
*   **A Quick Example** (See how the Event Loop works in practice)

How does that sound? Ready to get started?`,
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

    let ragEngine = LLM.initRAG("domain");

    // const response = await ragEngine.callWithRelevantContext(goalId, prompt);

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
