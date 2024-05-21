import { NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import User from "../user/user.model";

module.exports = function () {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.cookies.accessToken) {
        const { _id } = jwt.decode(req.cookies.accessToken) as any; // todo fix any
        const user = await User.findById(_id).populate({ path: "role" }).lean();
        // req.user = { ...user, role: { name: "agency" } };
        req.user = user;
      }
    } catch (error) {
      console.log(error);
    }
    return next();
  };
};
