import { LearningPath, NewLearnerGoal } from "../types/goal";
import * as goalModels from "../models/goal.models";

export const createNewGoal = async (
  learnerGoal: NewLearnerGoal,
  userId: string,
  learningPath: LearningPath
) => {
  try {
    let newGoal = await goalModels.createNewLearnerGoal(
      learnerGoal,
      userId,
      learningPath
    );

    return newGoal;
  } catch (error) {
    console.error(
      `Error occurred while creating new goal for profile for user id ${userId}.`,
      error
    );

    throw new Error(
      `Error occurred while creating new goal for profile for user id ${userId}. ` +
        error
    );
  }
};
