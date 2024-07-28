import { Request } from "express";
import _ from "lodash";
import User from "./user.model";
import { UserInterface } from "./user.interface";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import ApiErr from "../utils/ApiErr";
import { ROLES } from "../utils/const";

export async function getUserFromCookie(req: Request, lean = false) {
  if (!req.cookies.accessToken) {
    throw new ApiErr(StatusCodes.NOT_FOUND, "ابتدا وارد شوید");
  }
  const { _id } = jwt.decode(req.cookies.accessToken) as any; // todo fix any
  const res = User.findById(_id);
  if (lean) return res.lean();
  console.log({ _id, res, lean });

  return res;
}

export const getUserById = async (
  id: string
): Promise<UserInterface | null> => {
  return User.findById(id).lean().exec();
};

export const updateUser = async (
  id: string,
  updateData: Partial<UserInterface>
): Promise<UserInterface | null> => {
  return User.findByIdAndUpdate(id, updateData, { new: true }).lean().exec();
};

export const IsAdmin = (user: UserInterface) => {
  return user.role === ROLES.admin;
};
