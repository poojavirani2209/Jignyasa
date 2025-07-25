import { Request, Response } from "express";
import * as profileServices from "../services/profile.services";
import * as domainServices from "../services/domain.service";
import * as goalServices from "../services/goal.services";

import { LearnerProfile } from "../types/profile";
import { LearnerGoal, LearningPath, Question } from "../types/goal";

export const createNewGoal = async (req: Request, res: Response) => {
  const { goal, days, hoursPerDay } = req.body;
  console.log("Gaol body" + goal);

  const userId = (req as any).userId;
  const files = req.files as Express.Multer.File[];

  try {
    const learnerProfile: LearnerProfile =
      await profileServices.getProfileByUserId(userId);
    const learningStyle = learnerProfile.userDeclaredlearningStyle;

    const newGoal: LearnerGoal = await goalServices.createNewGoal(
      { goal, days, hoursPerDay },
      (req as any).userId
    );

    let learningPath: LearningPath = (await domainServices.createPlan(
      newGoal,
      files,
      learningStyle
    )) as LearningPath;

    await goalServices.updateGoal(
      newGoal.id,
      { id: newGoal.id, userId, goal, days, hoursPerDay, learningPath },
      learningPath
    );

    await goalServices.addGoalDocs(newGoal.id, files);

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

export const getGoalsForUser = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  try {
    const goals: LearnerGoal[] = await goalServices.fetchAllGoalsForUser(
      userId
    );

    res.status(200).json({ goals });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: `Error occurred while fetching goals for the user by id ${userId}.`,
      details: error.message,
    });
  }
};
