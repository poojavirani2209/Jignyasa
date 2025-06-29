import {
  ForbiddenError,
  NotFoundError,
  UnAuthorizedError,
} from "../errors/api-errors";
import { createNewUser, getUserByUserName } from "../models/user.models";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import { User } from "../types/user";
import { createNewLearnerProfile } from "../models/profile.models";
import { LearnerProfile } from "../types/profile";
import * as profileModels from "../models/profile.models";
import { access } from "fs";

export const register = async (userName: string, password: string) => {
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user: User = await createNewUser(userName, hashed);
    const token = generateToken(user.id);
    const profile = await createNewLearnerProfile(user.id);
    return { accessToken: token, profile };
  } catch (error) {
    console.error(
      `Error occurred while registering a new user with name ${userName}.`,
      error
    );

    if (error instanceof ForbiddenError || error instanceof NotFoundError) {
      throw error;
    }

    throw new Error(
      `Error occurred while registering a new user with name ${userName}.` +
        error
    );
  }
};

export const login = async (userName: string, password: string) => {
  try {
    const user: User = await getUserByUserName(userName);
    if (!user) {
      throw new UnAuthorizedError(`Invalid credentials`);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnAuthorizedError(`Invalid credentials`);
    }

    const token = generateToken(user.id);

    const profile: LearnerProfile = await profileModels.getProfileByUserId(
      user.id
    );
    console.log(`Successfully logged in user.`);
    return { accessToken: token, profile };
  } catch (error) {
    console.error(
      `Error occurred while logging a user with name ${userName}.`,
      error
    );

    if (error instanceof UnAuthorizedError) {
      throw error;
    }

    throw new Error(
      `Error occurred while logging a user with name ${userName}.` + error
    );
  }
};
