import { LLMMessage } from "../ai-server/languageModels/provider";
import * as goalServices from "../services/goal.services";
import { LearnerGoal } from "../types/goal";
import * as chatServices from "../services/chat.services";
import { QuizPerformance } from "../types/chat";
import * as logServices from "../services/log.services";
import * as LanguageModel from "../ai-server/languageModels";
import { Dashboard } from "../types/dashboard";

export const analyzeSubTopicSession = async (
  subTopicName: string,
  goalId: string,
  quizPerformance: QuizPerformance,
  userId: string
) => {
  try {
    const learnerGoal: LearnerGoal = await goalServices.fetchGoal(goalId);
    let chatHistory: LLMMessage[] = await chatServices.fetchChatHistory(
      subTopicName,
      goalId,
      userId
    );

    let interactionLogs = await logServices.fetchInteractionLogs(
      userId,
      goalId,
      subTopicName
    );

    let emotionLogs = await logServices.fetchEmotionLogs(
      userId,
      goalId,
      subTopicName
    );

    const prompt = `You're an intelligent learning analyst helping an EdTech platform evaluate how a student performed in a subtopic session.
Use the data below to:
1. Calculate a **Retention Score** (0–1): based on quiz accuracy.
2. Analyze the user's interaction style and infer their **VARK learning preference** (Visual, Auditory, Reading/Writing, Kinesthetic). Provide scores for each (0–1).
3. Provide a **summary feedback** for the learner — what they did well and what they should improve.
4. Give tutor-specific advice on how to adapt future sessions for this learner.

Learning Goal:  
"${learnerGoal.goal}"

Subtopic Name:  
"${subTopicName}"

Chat History (between tutor and learner):  
${JSON.stringify(chatHistory)}


Quiz Performance: It had 2 objects:
questions: each question has a correct option number
answers: these are learner answers. 
Compare each answer text with corresponding index question, correct option number text. Accordingly calculate retention score. 
${JSON.stringify(quizPerformance)}

Interaction Logs:
(Includes time spent, completed status, and type of resource: video, article, TTS)
${JSON.stringify(interactionLogs, null, 2)}

Emotion Logs:
(Includes timestamp, emotion at the moment, confidence in emotion)
${JSON.stringify(emotionLogs, null, 2)}

Respond in strict JSON format:
{
  "retentionScore": 0.76,
  "varkScores": {
    "visual": 0.5,
    "auditory": 0.8,
    "reading": 0.3,
    "kinesthetic": 0.2
  },
  "mostLikelyVARK": "Auditory",
  "tutorFeedback": {
    "whatWentWell": "The learner asked thoughtful questions and used TTS consistently.",
    "whatToImprove": "The learner should engage more with reading materials and clarify doubts earlier."
  },
  "recommendations": "Use more auditory explanations and follow up with quiz-based reinforcement. Avoid overloading with long articles."
}
`;

    let llmEngine = LanguageModel.initLLM("analyzer");
    const response = await llmEngine.chat([{ role: "user", content: prompt }]);

    // const content = {
    //   retentionScore: 0.76,
    //   varkScores: {
    //     visual: 0.5,
    //     auditory: 0.8,
    //     reading: 0.3,
    //     kinesthetic: 0.2,
    //   },
    //   mostLikelyVARK: "auditory",
    //   tutorFeedback: {
    //     whatWentWell:
    //       "The learner actively engaged with the audio tutor sessions and interacted well with the article-based materials.",
    //     whatToImprove:
    //       "The learner should consider diversifying input by occasionally reviewing visual content like diagrams or short animations, and clarifying doubts earlier for better concept retention.",
    //   },
    //   recommendations:
    //     "Use more auditory explanations and follow up with quiz-based reinforcement. Avoid overloading with long articles. Try project-based learning to apply concepts in real-world ways and keep engagement high.",
    // };
    // let response = { content };

    try {
      console.log("LLM Response" + JSON.stringify(response.content));
      return response.content as unknown as Dashboard;
    } catch (err) {
      throw new Error("Invalid LLM response");
    }
  } catch (error) {
    console.error("Failed to analyze subtopic session", error);
    throw error;
  }
};

export const analyzeEmotion = async (imagePath: string) => {
  try {
    const prompt = `You're an expert at reading emotions from images.

Given this image of a person using a learning app, classify the user's emotion into one of:
- Interested
- Frustrated
- Bored

Also provide a confidence score from 0 to 1.

Please return only a raw JSON object with the following structure:
{
  "emotion": "Frustrated",
  "confidence": 0.78
}
Do not include markdown, code blocks, or any extra text. Just output the JSON object.
`;

    let vlm = LanguageModel.initVLM("analyzer");
    const response = await vlm.chat([
      {
        role: "assistant",
        content: prompt,
        imagePath,
      },
    ]);

    // const content = {
    //   emotion: "Frustrated",
    //   confidence: 0.78,
    // };
    // let response = { content };

    try {
      console.log("VLM Response" + JSON.stringify(response.content));
      return response.content;
    } catch (err) {
      throw new Error("Invalid VLM response");
    }
  } catch (error) {
    console.error("Failed to analyze emotion from image", error);
    throw error;
  }
};
