
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../middleware/catchAsync";
import ApiErr from "./ApiErr";
import User from "../user/user.model";
import { ROLES, RoleType } from "./const";
import { responseGenerator } from "./response";

const checkPerm = (roles: RoleType[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      return next();

      if (!req.user) {
        throw new ApiErr(StatusCodes.NOT_FOUND, "login first");
      }
      const { _id } = req.user;
      const user: any = await User.findById({ _id });
      // todo fix any

      if (!user.role || ![...roles, ROLES.admin].includes(user.role.name))
        return res
          .status(StatusCodes.FORBIDDEN)
          .send(responseGenerator(undefined, "you dont have access"));
    } catch (error: any) {
      // todo fix any
      throw new ApiErr(
        error.statusCodes || StatusCodes.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  });

export { checkPerm };
