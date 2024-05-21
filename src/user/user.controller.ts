import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import User from "./user.model";
import {
  getUserById,
  updateUser,
} from "./user.service";
import catchAsync from "../middleware/catchAsync";
import { responseGenerator } from "../utils/response";
import ApiErr from "../utils/ApiErr";

export const getOne = catchAsync(async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) return res.status(StatusCodes.NOT_FOUND).send(null);

    return res.send(responseGenerator(user));
  } catch (error: any) {
    // todo fix any
    throw new ApiErr(
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      error
    );
  }
});

export const createOne = catchAsync(async (req: Request, res: Response) => {
  try {
    const user = new User({ ...req.body });
    await user.save();

    return res.send(responseGenerator(user));
  } catch (error: any) {
    // todo fix any
    throw new ApiErr(
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      error
    );
  }
});

export const updateById = async (req: Request, res: Response) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.json({ data: user, status: "success" });
  } catch (err: any) {
    // todo fix any
    res.status(500).json({ error: err.message });
  }
};

export const getOneWithId = catchAsync(async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: "id is required" });
    const result: any = await getUserById(id); // todo fix any
    if (!result)
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: "user not found" });
    const { _id, __v, updatedAt, createdAt, ...rest } = result._doc;
    res.send({ data: { ...rest } });
  } catch (error: any) {
    // todo fix any
    // console.log(error);
    throw new ApiErr(
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      error
    );
  }
});

