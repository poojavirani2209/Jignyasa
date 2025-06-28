import { Transaction } from "sequelize";
import { User as UserModel } from "../model";
import { User } from "../types/user";

export const getUserByUserName = async (
  userName: string,
  transaction?: Transaction
): Promise<User | null> => {
  const user: any = await UserModel.findOne({
    where: { username: userName },
    transaction,
  });
  console.log(user)
  return user.dataValues;
};

export const createNewUser = async (
  username: string,
  hashedPassword: string,
  transaction?: Transaction
) => {
  const user = await UserModel.create(
    { username, password: hashedPassword },
    { transaction }
  );
  return user.dataValues;
};
