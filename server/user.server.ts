import type { User } from "./types.server";
import type { ObjectId } from "mongoose";
import UserModel from "~/models/user.model.server";

export async function getUserById(userId: ObjectId): Promise<User | null> {
  return UserModel.findById(userId).exec();
}

export async function verifyLogin(
  email: User["email"],
  password: User["password"]
) {
  const userWithPassword = await UserModel.findOne({ email }).exec();

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await userWithPassword.comparePassword(password);

  if (!isValid) {
    return null;
  }

  const {
    password: _password,
    _v,
    _id,
    ...userWithoutPassword
  } = userWithPassword;

  return { ...userWithoutPassword, id: _id };
}
