import { Transaction } from "sequelize";
import { LearnerGoal as LearnerGoalModel, ChatHistory } from "../model";
import { LLMMessage } from "../llm/provider";
import { ChatHistoryMetaData } from "../types/chat";

type ChatHistoryUpdate = Partial<Omit<ChatHistoryMetaData, "id">>;

export const createNewChat = async (
  subTopicName: string,
  goalId: string,
  userId: string,
  messages: LLMMessage[],
  transaction?: Transaction
) => {
  const newChat = await ChatHistory.create(
    {
      userId,
      goalId,
      messages,
      subTopicName,
    },
    { transaction }
  );
  return newChat;
};

export const updateChatForSubTopicForUserId = async (
  subTopicName: string,
  goalId: string,
  userId: string,
  updateChatHistoryProperties: ChatHistoryUpdate,
  transaction?: Transaction
) => {
  await ChatHistory.update(updateChatHistoryProperties, {
    where: {
      userId,
      goalId,
      subTopicName,
    },
    transaction,
  });
};
