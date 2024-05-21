import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { getUserFromCookie } from "../user/user.service";
import { responseGenerator } from "../utils/response";
import ApiErr from "../utils/ApiErr";

module.exports = function () {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req?.body?.token ||
      req?.query?.token ||
      req?.headers["x-access-token"] ||
      req?.cookies.accessToken;
    // decode token
    if (token) {
      const user = await getUserFromCookie(req, true);

      if (!user)
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send(responseGenerator(undefined, "یوزر یافت نشد"));
      // verifies secret and checks exp
      // console.log({token, user})
      if (user.status !== "active")
        return res
          .status(StatusCodes.FORBIDDEN)
          .send(responseGenerator(undefined, "یوزر فعال نیست"));
      jwt.verify(
        token,
        user.sig || (process.env.secret as string),
        function (error: any, decoded: any) {
          // todo fix any

          if (error) {
            new ApiErr(error.statusCode || StatusCodes.UNAUTHORIZED, error);
            return res
              .status(error.statusCode || StatusCodes.UNAUTHORIZED)
              .send(responseGenerator(undefined, error.message));
          }
          req.decoded = decoded;
          next();
        }
      );
    } else {
      // if there is no token
      new ApiErr(StatusCodes.UNAUTHORIZED, "Token Missing");
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send(responseGenerator(undefined, "token missing"));
    }
  };
};
