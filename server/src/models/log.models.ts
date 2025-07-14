import { Transaction } from "sequelize";
import { InteractionLog } from "../model";
import { NewInterationLog } from "../types/log";

export const captureInteractionLog = async (
  newLog: NewInterationLog,
  userId: string,
  transaction?: Transaction
) => {
  const interactionLog = await InteractionLog.create(
    { ...newLog, userId },
    { transaction }
  );
};

export const fetchInteractionLogs = async (
  userId: string,
  goalId: string,
  subTopicName: string,
  transaction?: Transaction
) => {
  const interactionLogs = (await InteractionLog.findAll({
    where: {
      goalId,
      userId,
      subTopicName,
    },
    transaction,
  })) as unknown as InteractionLog[];
  return interactionLogs;
};
