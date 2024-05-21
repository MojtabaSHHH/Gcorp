import express ,{ NextFunction, Request, Response } from "express";
import router from "./router";
import createError from "http-errors";


const index = express();

index.use(express.json());

index.use("/", router);

index.use("/", async (req :Request, res : Response) => {
  res.send("درحال اجرا");
});

index.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
index.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "express-test" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default index;