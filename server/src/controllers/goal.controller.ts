import { Request, Response } from "express";
import * as profileServices from "../services/profile.services";
import * as domainServices from "../services/domain.service";
import * as goalServices from "../services/goal.services";

import { LearnerProfile } from "../types/profile";
import { LearningPath, Question } from "../types/goal";

export const createNewGoal = async (req: Request, res: Response) => {
  const { goal, days, hoursPerDay } = req.body;
  const userId = (req as any).userId;
  try {
    const learnerProfile: LearnerProfile =
      await profileServices.getProfileByUserId(userId);
    const learningStyle = learnerProfile.userDeclaredlearningStyle;

    let learningPath: LearningPath = (await domainServices.createPlan(
      { goal, days, hoursPerDay },
      learningStyle
    )) as LearningPath;

    const newGoal = await goalServices.createNewGoal(
      { goal, days, hoursPerDay },
      (req as any).userId,
      learningPath
    );

    res.status(200).json({ goalId: newGoal.id, learningPath });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: `Error occurred while creating new goal for the user by id ${userId}.`,
      details: error.message,
    });
  }
};

export const preGoalKnowledgeQuestionarrie = async (
  req: Request,
  res: Response
) => {
  const { goal, days, hoursPerDay } = req.body;
  const userId = (req as any).userId;
  try {
    const learnerProfile: LearnerProfile =
      await profileServices.getProfileByUserId(userId);
    const learningStyle = learnerProfile.userDeclaredlearningStyle;

    let questionarrie: Question[] =
      await domainServices.createPreKnowledgeQuestionarrie(
        { goal, days, hoursPerDay },
        learningStyle
      );

    res.status(200).json({ questionarrie });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: `Error occurred while creating pre knowledge questionarrie for the user by id ${userId}.`,
      details: error.message,
    });
  }
};
