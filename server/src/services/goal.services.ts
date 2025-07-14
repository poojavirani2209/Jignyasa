import { LearnerGoal, LearningPath, NewLearnerGoal } from "../types/goal";
import * as goalModels from "../models/goal.models";

export const createNewGoal = async (
  learnerGoal: NewLearnerGoal,
  userId: string
) => {
  try {
    let newGoal: LearnerGoal = await goalModels.createNewLearnerGoal(
      learnerGoal,
      userId
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

export const updateGoal = async (
  goalId: string,
  learnerGoal: LearnerGoal,
  learningPath: LearningPath
) => {
  try {
    await goalModels.updateLearnerGoal(goalId, learnerGoal, learningPath);
  } catch (error) {
    console.error(
      `Error occurred while updating goal with id ${goalId}.`,
      error
    );

    throw new Error(
      `Error occurred while updating goal with id ${goalId}.` + +error
    );
  }
};

export const addGoalDocs = async (goalId: string, files: any) => {
  try {
    for (const file of files) {
      await goalModels.addNewLearnerGoalDoc(goalId, file);
    }
  } catch (error) {
    console.error(
      `Error occurred while adding files for goal. Will proceed without it`,
      error
    );

    throw new Error(
      `Error occurred while adding files for goal. Wil proceed without it.` +
        error
    );
  }
};

export const fetchGoal = async (goalId: string) => {
  try {
    let goal: LearnerGoal = await goalModels.fetchGoal(goalId);
    return goal;
  } catch (error) {
    console.error(`Error occurred while fetching goal with ${goalId}.`, error);

    throw new Error(
      `Error occurred while fetching goal with ${goalId}.` + error
    );
  }
};
