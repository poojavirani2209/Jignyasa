import { Request, Response } from "express";
import * as profileServices from "../services/profile.services";
import * as chatServices from "../services/chat.services";
import * as goalServices from "../services/goal.services";

import * as tutorServices from "../services/tutor.services";

import { LearnerProfile } from "../types/profile";
import { LLMMessage } from "../ai-server/llm/provider";
import { LearnerGoal } from "../types/goal";

export async function initiateChat(req: Request, res: Response) {
  const { subtopic, goalId } = req.body;
  const userId = (req as any).userId;
  try {
    const learnerProfile: LearnerProfile =
      await profileServices.getProfileByUserId(userId);
    const learningStyle = learnerProfile.userDeclaredlearningStyle;
    let messages: LLMMessage[] = await tutorServices.startTutoring(
      goalId,
      subtopic,
      learningStyle
    );
    await chatServices.createNewChat(subtopic, goalId, userId, messages);
    res.status(200).json({ messages });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: `Error occurred while initiating new chat for the user by id ${userId}.`,
      details: error.message,
    });
  }
}

export async function chat(req: Request, res: Response) {
  const { subtopic, goalId, messages } = req.body;
  const userId = (req as any).userId;
  try {
    let newMessages: LLMMessage[] = await tutorServices.continueTutoring(
      messages
    );
    await chatServices.updateChat(subtopic, goalId, userId, newMessages);
    res.status(200).json({ newMessages });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: `Error occurred while continuing chat for the user by id ${userId}.`,
      details: error.message,
    });
  }
}

export async function chatQuiz(req: Request, res: Response) {
  const { subTopicName, goalId } = req.body;
  const userId = (req as any).userId;
  try {
    let chatHistory: LLMMessage[] = await chatServices.fetchChatHistory(
      subTopicName,
      goalId,
      userId
    );

    const goal: LearnerGoal = await goalServices.fetchGoal(goalId);
    const questionarrie = await tutorServices.createSubtopicQuiz(
      chatHistory,
      subTopicName,
      goalId,
      goal.goal
    );

    res.status(200).json({ questionarrie });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: `Error occurred while creating quiz for subTopic ${subTopicName} for goal by id ${goalId}.`,
      details: error.message,
    });
  }
}
