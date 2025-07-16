import { LearningStyle } from "../types/profile";
import { LLMMessage } from "../ai-server/llm/provider";
import { Question } from "../types/chat";

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
    // LLM.initLLM("tutor");

    // const response = await LLM.callLLM([
    //   { role: "system", content: "You are a helpful learning assistant." },
    //   { role: "user", content: prompt },
    // ]);

    // let ragEngine = LLM.initRAG("tutor");

    // const result = await ragEngine.callWithRelevantContext(goalId, prompt);

    const response = {
      content: `Absolutely! Let's dive into the Node.js Event Loop in a clear, visual, and interactive way. Here’s what we’ll cover in this session:

📚 Session Outline: Understanding the Node.js Event Loop
What is the Event Loop?

Simple analogy (like a restaurant server!)

Why it’s important in Node.js

How Node.js Handles Tasks

Synchronous vs Asynchronous

Where the event loop fits in

The Event Loop Phases (Visual Tour)

Timers

I/O callbacks

Poll

Check

Close callbacks

Common Examples

setTimeout

File reading

Promise and async/await

Interactive Challenge

Predict the output of a short code snippet

Wrap-Up

Review key takeaways

Reflect: When would you care about the event loop?

I'll be using visual analogies, simple metaphors, and interactive questions to keep it fun and effective.

👉 Are you ready to start the session? Or is there anything you’d like to add or focus more on?`,
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
