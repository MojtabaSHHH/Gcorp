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

export async function getUserById(id: string) {
  return User.findById(id);
}

export const updateUser = async (id: any, reqUser: any) => {
  const user = await User.findById(id);
  if (user)
    Object.keys(reqUser).map((key) => {
      (user as any)[key] = reqUser[key];
    });
  await user?.save();
  return user;
};

export const IsAdmin = (user: UserInterface) => {
  return user.role === ROLES.admin;
};
