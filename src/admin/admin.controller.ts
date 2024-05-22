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

export const createAdminController = async (req: Request, res: Response) => {
  const result = await createAdminService({
    ...req.body,
  });
  res.send(responseGenerator(result));
};

export const updateAdminController = async (req: Request, res: Response) => {
  try {
    const user = await updateAdminService(req.params.id, req.body);
    res.json({ data: user, status: "success" });
  } catch (err: any) {
    // todo fix any
    res.status(500).json({ error: err.message });
  }
};

export const getAdminsController = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const result = await getAdminsService(req.query);
      res.send(result);
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
    res.send(result);
  } catch (error: any) {
    throw new ApiErr(
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      error
    );
  }
});
