import { Transaction } from "sequelize";
import { LearnerProfile as LearnerProfileModel } from "../model";
import { LearnerProfile } from "../types/profile";

type LearnerProfileUpdate = Partial<Omit<LearnerProfile, "id">>;

export const createNewLearnerProfile = async (
  userId: string,
  transaction?: Transaction
) => {
  await LearnerProfileModel.create({ userId }, { transaction });
};

export const updateProfileById = async (
  id: string,
  updateProfileProperties: LearnerProfileUpdate,
  transaction?: Transaction
) => {
  await LearnerProfileModel.update(updateProfileProperties, {
    where: { id },
    transaction,
  });
};

export const updateProfileByUserId = async (
  userId: string,
  updateProfileProperties: LearnerProfileUpdate,
  transaction?: Transaction
) => {
  await LearnerProfileModel.update(updateProfileProperties, {
    where: { userId },
    transaction,
  });
};

export const getProfileByUserId = async (
  userId: string,
  transaction?: Transaction
): Promise<LearnerProfile | null> => {
  const profile: any = await LearnerProfileModel.findOne({
    where: { userId },
    transaction,
  });

  return profile;
};
