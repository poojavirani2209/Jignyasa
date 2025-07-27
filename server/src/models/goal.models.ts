import { Transaction } from "sequelize";
import { LearnerGoalDocs as LearnerGoalDocsModel, LearnerGoal as LearnerGoalModel } from "../model";
import { LearnerGoal, LearnerGoalDocs, LearningPath, NewLearnerGoal } from "../types/goal";

type LearnerGoalUpdate = Partial<Omit<LearnerGoal, "id">>;

export const createNewLearnerGoal = async (
  learnerGoal: NewLearnerGoal,
  userId: string,
  transaction?: Transaction
) => {
  const newGoal = await LearnerGoalModel.create(
    {
      userId: userId,
      goal: learnerGoal.goal,
      days: learnerGoal.days,
      hoursPerDay: learnerGoal.hoursPerDay,
      learningPath: "",
    },
    { transaction }
  );
  return JSON.parse(JSON.stringify(newGoal)) as LearnerGoal;
};

export const updateLearnerGoal = async (
  goalId: string,
  learnerGoal: LearnerGoal,
  learningPath: LearningPath,
  transaction?: Transaction
) => {
  await LearnerGoalModel.update(
    {
      userId: learnerGoal.userId,
      goal: learnerGoal.goal,
      days: learnerGoal.days,
      hoursPerDay: learnerGoal.hoursPerDay,
      learningPath: learningPath,
    },
    { where: { id: goalId }, transaction }
  );
};

export const addNewLearnerGoalDoc = async (
  goalId: string,
  file: any,
  transaction?: Transaction
) => {
  const newGoalDoc = await LearnerGoalDocsModel.create(
    {
      goalId,
      filename: file.originalname,
      filepath: file.path,
    },
    { transaction }
  );
  return newGoalDoc;
};

export const fetchGoalLearnerGoalDoc = async (
  goalId: string,
  transaction?: Transaction
) => {
  const goalDocs = await LearnerGoalDocsModel.findAll({
    where: {
      goalId,
    },
    transaction,
  });
  return goalDocs as LearnerGoalDocs[];
};

export const fetchGoal = async (goalId: string, transaction?: Transaction) => {
  const goal = await LearnerGoalModel.findOne({
    where: {
      id: goalId,
    },
    transaction,
  });
  return JSON.parse(JSON.stringify(goal)) as LearnerGoal;
};

export const fetchAllGoalsForUser = async (
  userId: string,
  transaction?: Transaction
) => {
  const goals = await LearnerGoalModel.findAll({
    where: {
      userId,
    },
    transaction,
  });
  return JSON.parse(JSON.stringify(goals)) as LearnerGoal[];
};
