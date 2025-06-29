import { NotFoundError } from "../errors/api-errors";
import * as profileModels from "../models/profile.models";
import { LearningStyle } from "../types/profile";

export const getProfileByUserId = async (userId: string) => {
  try {
    let profile = await profileModels.getProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError(
        `The Profile with user id ${userId} does not exists.`
      );
    }
    return profile;
  } catch (error) {
    console.error(
      `Error occurred while getting profile with user id ${userId}.`,
      error
    );

    if (error instanceof NotFoundError) {
      throw error;
    }

    throw new Error(
      `Error occurred while getting profile with user id ${userId}. ` + error
    );
  }
};

export const updateLearningStyleOfProfileByUserId = async (
  userId: string,
  userDeclaredlearningStyle: LearningStyle
) => {
  try {
    let newProfile = await profileModels.updateProfileByUserId(userId, {
      userDeclaredlearningStyle,
    });

    return newProfile;
  } catch (error) {
    console.error(
      `Error occurred while updating learning style of profile with user id ${userId}.`,
      error
    );

    if (error instanceof NotFoundError) {
      throw error;
    }

    throw new Error(
      `Error occurred while updating learning style of profile with user id ${userId}. ` +
        error
    );
  }
};
