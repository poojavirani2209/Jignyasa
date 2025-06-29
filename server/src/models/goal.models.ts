import { Transaction } from "sequelize";
import { LearnerGoal as LearnerGoalModel } from "../model";
import { LearnerProfile } from "../types/profile";
import { LearnerGoal, LearningPath, NewLearnerGoal } from "../types/goal";

type LearnerGoalUpdate = Partial<Omit<LearnerGoal, "id">>;

export const createNewLearnerGoal = async (
  learnerGoal: NewLearnerGoal,
  userId: string,
  learningPath: LearningPath,
  transaction?: Transaction
) => {
  const newGoal = await LearnerGoalModel.create(
    {
      userId: userId,
      goal: learnerGoal.goal,
      days: learnerGoal.days,
      hoursPerDay: learnerGoal.hoursPerDay,
      learningPath: learningPath,
    },
    { transaction }
  );
  return newGoal;
};
