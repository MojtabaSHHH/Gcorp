import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../user/user.model";
import { StatusCodes } from "http-status-codes";
import { responseGenerator } from "../utils/response";

const UserAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req?.body?.token ||
    req?.query?.token ||
    req?.headers["x-access-token"] ||
    req?.cookies.accessToken;

  const decode = jwt.decode(req.cookies.accessToken) as any;

  if (!decode?._id) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send(responseGenerator(undefined, "لطفا ابتدا وارد شوید"));
  }
  const user = await User.findById(decode._id)
    .lean();

  if (!user || user.status !== "active") {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send(
        responseGenerator(undefined, "حساب شما غیر فعال است یا وجود ندارد")
      );
  }

  jwt.verify(
    token,
    user.sig || (process.env.accessTokenSecret as string),
    function (error: any, decoded: any) {
      if (error) {
        console.log({ error });
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send(responseGenerator(undefined, "نشست شما یه پایان رسیده"));
      }
      req.user = user;
      next();
    }
  );
};

export default UserAuthMiddleware;
