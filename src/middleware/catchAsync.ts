import { Request, Response, NextFunction } from "express";

const catchAsync =
  (fn: any) =>
  (req: Request, res: Response, next: NextFunction): void => {
    // todo fix any
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };

export default catchAsync;
