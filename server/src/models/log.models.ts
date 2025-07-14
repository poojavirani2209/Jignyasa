import { Transaction } from "sequelize";
import { EmotionLog, InteractionLog } from "../model";
import * as LogTypes from "../types/log";

export const captureInteractionLog = async (
  newLog: LogTypes.NewInterationLog,
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

export const captureEmotionLog = async (
  newLog: LogTypes.NewEmotionLog,
  userId: string,
  emotion: string,
  confidence: number,
  transaction?: Transaction
) => {
  const emotionLog = await EmotionLog.create(
    { ...newLog, userId, emotion, confidence },
    { transaction }
  );
};

export const fetchEmotionLogs = async (
  userId: string,
  goalId: string,
  subTopicName: string,
  transaction?: Transaction
) => {
  const emotionLogs = (await EmotionLog.findAll({
    where: {
      goalId,
      userId,
      subTopicName,
    },
    transaction,
  })) as unknown as LogTypes.EmotionLog[];
  return emotionLogs;
};