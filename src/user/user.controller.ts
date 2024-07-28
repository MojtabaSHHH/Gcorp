import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import User from "./user.model";
import { getUserById, updateUser } from "./user.service";
import catchAsync from "../middleware/catchAsync";
import { responseGenerator } from "../utils/response";
import ApiErr from "../utils/ApiErr";
import { UserInterface } from "./user.interface";

const localizeUser = (user: UserInterface, t: any) => {
  return {
    name: user.name,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    isPhoneVerified: user.isPhoneVerified,
    sig: user.sig,
    role: t(`user.roleOptions.${user.role}`),
    ssn: user.ssn,
    status: t(`user.statusOptions.${user.status}`),
    username: user.username,
    email: user.email,
    gender: t(`user.genderOptions.${user.gender}`),
    resetPasswordToken: user.resetPasswordToken,
    resetPasswordExpires: user.resetPasswordExpires,
  };
};

export const getOne = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserInterface;

  if (!user) return res.status(StatusCodes.NOT_FOUND).send(null);

  const localizedUser = localizeUser(user, req.t);
  return res.send(responseGenerator(localizedUser));
});

export const createOne = catchAsync(async (req: Request, res: Response) => {
  try {
    const user = new User({ ...req.body });
    await user.save();

    const localizedUser = localizeUser(user, req.t);
    return res.send(responseGenerator(localizedUser));
  } catch (error: any) {
    throw new ApiErr(
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      error
    );
  }
});

export const updateById = catchAsync(async (req: Request, res: Response) => {
  try {
    const user = (await updateUser(req.params.id, req.body)) as UserInterface;
    const localizedUser = localizeUser(user, req.t);
    res.json({ data: localizedUser, status: "success" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const getOneWithId = catchAsync(async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: req.t("errors.idRequired") });
    }
    const result = await getUserById(id);
    if (!result) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: req.t("errors.userNotFound") });
    }
    const { _id, __v, updatedAt, createdAt, ...rest } = result;

    const localizedUser = {
      ...rest,
      role: req.t(`user.roleOptions.${rest.role}`),
      status: req.t(`user.statusOptions.${rest.status}`),
      gender: req.t(`user.genderOptions.${rest.gender}`),
    };

    res.send({ data: localizedUser });
  } catch (error: any) {
    throw new ApiErr(
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      error
    );
  }
});
