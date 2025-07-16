import { Request, Response } from "express";
import * as analysisServices from "../services/analysis.services";
import * as profileServices from "../services/profile.services";
import { LearningStyle } from "../types/profile";

export const analyzeSubTopicSession = async (req: Request, res: Response) => {
  const { quizPerformance, goalId, subTopicName } = req.body;
  const userId = (req as any).userId;

  try {
    const response = await analysisServices.analyzeSubTopicSession(
      subTopicName,
      goalId,
      quizPerformance,
      userId
    );

    await profileServices.updateLearningStyleOfProfileByUserId(userId, {
      retentionRate: response.retentionScore,
      tutorFeedbackSummary: JSON.stringify({
        whatWentWell: response.tutorFeedback.whatWentWell,
        whatToImprove: response.tutorFeedback.whatToImprove,
      }),
      adaptiveLearningStyle:response.mostLikelyVARK as LearningStyle
    }); //TODO vark scores

    res.status(200).json(response);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: `Error occurred while analyzing subtopic session.`,
      details: error.message,
    });
  }
};
