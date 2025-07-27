import * as chatModels from "../models/chat.models";
import { LLMMessage } from "../ai-server/languageModels/provider";

export const createNewChat = async (
  subTopicName: string,
  goalId: string,
  userId: string,
  messages: LLMMessage[]
) => {
  try {
    let newChat = await chatModels.createNewChat(
      subTopicName,
      goalId,
      userId,
      messages
    );

    return newChat;
  } catch (error) {
    console.error(
      `Error occurred while creating new chat for profile for user id ${userId}.`,
      error
    );

    throw new Error(
      `Error occurred while creating new chat for profile for user id ${userId}. ` +
        error
    );
  }
};

export const updateChat = async (
  subTopicName: string,
  goalId: string,
  userId: string,
  messages: LLMMessage[]
) => {
  try {
    let newChat = await chatModels.updateChatForSubTopicForUserId(
      subTopicName,
      goalId,
      userId,
      { messages }
    );

    return newChat;
  } catch (error) {
    console.error(
      `Error occurred while creating new chat for profile for user id ${userId}.`,
      error
    );

    throw new Error(
      `Error occurred while creating new chat for profile for user id ${userId}. ` +
        error
    );
  }
};

export const fetchChatHistory = async (
  subTopicName: string,
  goalId: string,
  userId: string,
) => {
  try {
    let chatHistory:LLMMessage[] = await chatModels.fetchChatHistory(
      subTopicName,
      goalId,
      userId,
    );

    return chatHistory;
  } catch (error) {
    console.error(
      `Error occurred while creating new chat for profile for user id ${userId}.`,
      error
    );

    throw new Error(
      `Error occurred while creating new chat for profile for user id ${userId}. ` +
        error
    );
  }
};