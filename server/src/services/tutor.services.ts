import { LearningStyle } from "../types/profile";
import { LLMMessage } from "../ai-server/languageModels/provider";
import { Question } from "../types/chat";
import * as LLM from "../ai-server/languageModels";
import * as goalServices from "./goal.services";
import { LearnerGoalDocs } from "../types/goal";

export const startTutoring = async (
  goalId: string,
  subTopicName: string,
  userDeclaredlearningStyle: LearningStyle,
  adaptiveLearningStyle: LearningStyle
) => {
  try {
    const prompt = `You are an expert one-on-one personal tutor. Your role is to teach the following topic in a clear, engaging, and interactive way, using layman’s terms and adapting to the learner’s style:

Topic: ${subTopicName}

Preferred Learning Style (User-declared): ${userDeclaredlearningStyle}

Adaptive Learning Style (System-analyzed): ${adaptiveLearningStyle}

Your Objectives:

1. Teach the topic primarily aligned with the adaptive learning style, but be mindful of the user’s preferred style.

2. Present content using analogies, everyday examples, interactive questions, or hands-on reflections—based on the learner’s style.

3. Ensure the tone is friendly, focused, and easy to follow, avoiding jargon.

4. Start by outlining what will be covered in the session and then ask the learner if they’re ready to begin.

As the session progresses:

1. Regularly check for understanding

2. Adapt explanations if confusion is likely

3. Encourage simple reflection, trial, or response

4. Make the session feel like a conversation—not a lecture.

Begin with a short outline of the topic and a friendly invitation:
“Here’s what we’ll cover today...”
`;

    let ragEngine = LLM.getRAGEngine("domain");

    try {
      let docs = await goalServices.fetchAllGoalDocs(goalId);
      let filePaths = docs.map((doc: LearnerGoalDocs) => {
        return doc.filepath;
      });
      await ragEngine.createVectorStore(goalId, filePaths);

      let responseMessages: LLMMessage[] =
        await ragEngine.callWithRelevantContext(goalId, prompt);

      //     response = {
      //       content: `Okay, let's dive into the fascinating world of the Node.js Event Loop! I understand you prefer a visual learning style, but since you also analyze as being an auditory learner, I'll make sure the explanations are clear and concise and that you can follow along!

      // Here's what we'll cover today:

      // *   **What is the Event Loop?** (The core concept!)
      // *   **Why is it important?** (Benefits and how it makes Node.js fast)
      // *   **How it works (Simplified)** (Step-by-step breakdown)
      // *   **Sync vs. Async code (Quick Refresher)** (Making sure you understand the difference)
      // *   **The different phases of the Event Loop (Simplified)** (See how the Event Loop handles different tasks)
      // *   **Worker Pool and the Event Loop (Simplified)** (Letting you know that the Event Loop does not handle every task and what tasks it handles)
      // *   **A Quick Example** (See how the Event Loop works in practice)

      // How does that sound? Ready to get started?`,
      //     };
      return responseMessages;
    } catch (err) {
      console.error("Failed to parse tutor response:");
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
    let ragEngine = LLM.getRAGEngine("domain");
    const lastInput = messages[messages.length - 1];

    let response = await ragEngine.callWithRelevantContext(
      goalId,
      lastInput.content,
      messages.slice(0, -1)
    );
    //     response = {
    //       content: `Okay, let's dive into the fascinating world of the Node.js Event Loop! I understand you prefer a visual learning style, but since you also analyze as being an auditory learner, I'll make sure the explanations are clear and concise and that you can follow along!

    // Here's what we'll cover today:

    // *   **What is the Event Loop?** (The core concept!)
    // *   **Why is it important?** (Benefits and how it makes Node.js fast)
    // *   **How it works (Simplified)** (Step-by-step breakdown)
    // *   **Sync vs. Async code (Quick Refresher)** (Making sure you understand the difference)
    // *   **The different phases of the Event Loop (Simplified)** (See how the Event Loop handles different tasks)
    // *   **Worker Pool and the Event Loop (Simplified)** (Letting you know that the Event Loop does not handle every task and what tasks it handles)
    // *   **A Quick Example** (See how the Event Loop works in practice)

    // How does that sound? Ready to get started?`,
    //     };

    try {
      return response;
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

    let ragEngine = LLM.getRAGEngine("domain");

    const response = await ragEngine.callWithRelevantContext(goalId, prompt);

    // const content: Question[] = [
    //   {
    //     id: "q1",
    //     question: "What is the event loop?",
    //     options: [
    //       "A loop in JS",
    //       "It processes async events",
    //       "Stack overflow",
    //       "A timer",
    //     ],
    //     correctAnswerOption: 1,
    //   },
    //   {
    //     id: "q2",
    //     question: "Which part of Node.js handles the callback queue?",
    //     options: ["Thread Pool", "Event Loop", "Call Stack", "Heap"],
    //     correctAnswerOption: 2,
    //   },
    // ];
    // let response = { content };

    try {
      console.log("LLM Response" + JSON.stringify(response));
      return response[1].content;
    } catch (err) {
      console.error("Failed to parse questions JSON:", response.content);
      throw new Error("Invalid LLM response");
    }
  } catch (error) {
    console.error("Failed to create pre knowledge questionarrie", error);
    throw error;
  }
};
