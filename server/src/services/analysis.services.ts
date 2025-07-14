import * as LLM from "../ai-server/llm";
import { LLMMessage } from "../ai-server/llm/provider";
import * as goalServices from "../services/goal.services";
import { LearnerGoal } from "../types/goal";
import * as chatServices from "../services/chat.services";
import { QuizPerformance } from "../types/chat";
import * as logServices from "../services/log.services";

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


Quiz Performance:
(Each object has the question, correct answer, user's selected answer)
${JSON.stringify(quizPerformance)}

Interaction Logs:
(Includes time spent, completed status, and type of resource: video, article, TTS)
${JSON.stringify(interactionLogs, null, 2)}

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

    // let ragEngine = LLM.initLLM("analyzer");
    // //callllm

    const content = {
      retentionScore: 0.76,
      varkScores: {
        visual: 0.5,
        auditory: 0.8,
        reading: 0.3,
        kinesthetic: 0.2,
      },
      mostLikelyVARK: "Kinesthetic",
      tutorFeedback: {
        whatWentWell:
          "The learner asked thoughtful questions and used TTS consistently.",
        whatToImprove:
          "The learner should engage more with reading materials and clarify doubts earlier.",
      },
      recommendations:
        "Use more auditory explanations and follow up with quiz-based reinforcement. Avoid overloading with long articles.",
    };
    let response = { content };

    try {
      console.log("LLM Response" + JSON.stringify(response.content));
      return response.content;
    } catch (err) {
      throw new Error("Invalid LLM response");
    }
  } catch (error) {
    console.error("Failed to analyze subtopic session", error);
    throw error;
  }
};
