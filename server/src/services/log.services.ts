import { ForbiddenError, NotFoundError } from "../errors/api-errors";

import * as logModels from "../models/log.models";
import { NewInterationLog } from "../types/log";

export const captureInteractionLog = async (
  newLog: NewInterationLog,
  userId: string
) => {
  try {
    await logModels.captureInteractionLog(newLog, userId);
  } catch (error) {
    console.error(`Error occurred while capturing new interaction log.`, error);

    if (error instanceof ForbiddenError || error instanceof NotFoundError) {
      throw error;
    }

    throw new Error(
      `Error occurred while capturing new interaction log.` + error
    );
  }
};

export const fetchInteractionLogs = async (
  userId: string,
  goalId: string,
  subTopicName: string
) => {
  try {
    const interactionLogs = await logModels.fetchInteractionLogs(
      userId,
      goalId,
      subTopicName
    );
    return interactionLogs;
  } catch (error) {
    console.error(`Error occurred while fetching interaction logs.`, error);

    if (error instanceof ForbiddenError || error instanceof NotFoundError) {
      throw error;
    }

    throw new Error(`Error occurred while fetching interaction logs.` + error);
  }
};
