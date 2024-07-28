import { Model, ObjectId, Types } from "mongoose";
import { RoleType } from "../utils/const";

export interface UserInterface {
  _id?: string | Types.ObjectId;
  name?: string;
  lastName?: string;
  phoneNumber?: string;
  isPhoneVerified?: boolean;
  sig?: string;
  role?: RoleType;
  status?: string;
  ssn?: string;
  username?: string;
  password?: string;
  email?: string;
  gender?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  __v: Date;
  updatedAt: Date;
  createdAt: Date;
}

export interface UserMethodsInterface {
  comparePass: (
    pass: string,
    callBack: (error: unknown, result: boolean) => void
  ) => void;
}

export type UserModel = Model<UserInterface, {}, UserMethodsInterface>;
