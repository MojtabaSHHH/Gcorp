import { Request, Response } from "express";
import { responseGenerator } from "../utils/response";
import catchAsync from "../middleware/catchAsync";
import ApiErr from "../utils/ApiErr";
import { StatusCodes } from "http-status-codes";
import {
  createAdminService,
  getAdminsService,
  getAllUsers,
  updateAdminService,
} from "./admin.service";

const localizeAdmin = (user: any, t: any) => {
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

export const createAdminController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await createAdminService(req.body);
    const localizedAdmin = localizeAdmin(result, req.t);
    res.send(responseGenerator(localizedAdmin));
  }
);

export const updateAdminController = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const user = await updateAdminService(req.params.id, req.body);
      const localizedAdmin = localizeAdmin(user, req.t);
      res.json({ data: localizedAdmin, status: "success" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export const getAdminsController = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const result = await getAdminsService(req.query);
      const localizedAdmins = result.data.map((admin: any) =>
        localizeAdmin(admin, req.t)
      );
      res.send({ data: localizedAdmins, count: result.count });
    } catch (error: any) {
      throw new ApiErr(
        error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    }
  }
);

export const getAll = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await getAllUsers(req.query, req.user);
    const localizedUsers = result.data.map((user: any) =>
      localizeAdmin(user, req.t)
    );
    res.send({ data: localizedUsers, count: result.count });
  } catch (error: any) {
    throw new ApiErr(
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      error
    );
  }
});
