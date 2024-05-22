import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../middleware/catchAsync";
import ApiErr from "../utils/ApiErr";
import { responseGenerator } from "../utils/response";
import User from "../user/user.model";
import jwt from "jsonwebtoken";
import { setJwtAccessToken } from "./auth.service";
import { validationResult } from "express-validator";
import RefreshTokenModel from "../refreshToken/refreshToken.model";
import { sendResetPasswordEmail } from "../utils/emailService";

const crypto = require("crypto");

export const loginWithEmail = catchAsync(
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send("ایمیل یا رمز عبور نادرست است");
    }

    user.comparePass(password, (error, isMatch) => {
      if (error) {
        throw new ApiErr(StatusCodes.INTERNAL_SERVER_ERROR, "خطای سرور");
      }
      if (!isMatch) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send("ایمیل یا رمز عبور نادرست است");
      }

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.accessTokenSecret as string,
        {
          expiresIn: Number(process.env.accessTokenLife),
        }
      );

      const refreshToken = RefreshTokenModel.createToken(user);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 14 * 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 14 * 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      });

      return res.send({ accessToken, refreshToken });
    });
  }
);

export const logout = catchAsync(async (req: Request, res: Response) => {
  try {
    res.cookie("accessToken", "", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 14 * 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });
    res.cookie("refreshToken", "", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 14 * 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });
    res.send(responseGenerator(undefined, "خروج موفقیت آمیز"));
  } catch (error: any) {
    // todo fix any
    console.log(error);
    throw new ApiErr(
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      error
    );
  }
});

export const verifyResetPasswordToken = catchAsync(
  async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("توکن نامعتبر یا منقضی شده است");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.accessTokenSecret as string,
      {
        expiresIn: Number(process.env.accessTokenLife),
      }
    );

    const refreshToken = await RefreshTokenModel.createToken(user);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 14 * 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 14 * 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    return res.status(StatusCodes.OK).send("رمز عبور با موفقیت تغییر کرد");
  }
);

export const sendResetPasswordEmailHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send("کاربر با این ایمیل پیدا نشد");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 ساعت اعتبار

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    await sendResetPasswordEmail(email, resetToken);

    return res.status(StatusCodes.OK).send("ایمیل ریست پسورد ارسال شد");
  }
);

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken: requestToken } = req.body;
  
    if (requestToken == null) {
      return res.status(403).json({ message: "تازه کردن توکن مورد نیاز است!" });
    }
  
    try {
      const refreshToken = await RefreshTokenModel.findOne({
        token: requestToken,
      });
  
      if (!refreshToken) {
        return res.status(403).json({ message: "نشانه بازخوانی ناشناخته!" });
      }
  
      if (RefreshTokenModel.verifyExpiration(refreshToken)) {
        await RefreshTokenModel.findByIdAndDelete(refreshToken._id, {
          useFindAndModify: false,
        }).exec();
        return res.status(403).json({
          message:
            "نشانه تازه کردن منقضی شده است. لطفاً یک درخواست ورود جدید ایجاد کنید",
        });
      }
  
      const user = await User.findById(refreshToken.user);
      if (!user) {
        return res.status(404).json({
          message: "کاربر پیدا نشد",
        });
      }
  
      const newAccessToken = setJwtAccessToken(user);
  
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 14 * 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      });
      
      return res.status(200).send();
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  });

//test

export const generateTokens__dev = catchAsync(
  async (req: Request, res: Response) => {
    const rs = await User.findById(req.params.id);
    if (!rs) return res.status(404).json({ message: "not found" });
    const accessToken = setJwtAccessToken(rs);
    const refreshToken = await RefreshTokenModel.createToken(rs);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    return res.send(responseGenerator({ user: rs }));
  }
);
