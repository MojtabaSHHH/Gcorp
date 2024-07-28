import { Response } from "express";
import ApiErr from "../utils/ApiErr";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import jwt from "jsonwebtoken";
import { UserInterface } from "../user/user.interface";
import User from "../user/user.model";
import SmsHelper from "../utils/SmsHelper";
import { pick, isEmpty } from "lodash";
import OtpModel from "../OTP/otp.model";
import RefreshTokenModel from "../refreshToken/refreshToken.model";

const searchOneUser = async (obj: UserInterface, err = true) => {
  try {
    const query = pick(obj, [
      "email",
      "phoneNumber",
      "name",
      "lastName",
      "_id",
    ]);
    const result = await User.findOne(query).populate("role");
    if (!result || isEmpty(result)) {
      if (err) {
        throw new ApiErr(
          StatusCodes.NOT_FOUND,
          getReasonPhrase(StatusCodes.NOT_FOUND)
        );
      }
      return false;
    }
    return result;
  } catch (error: any) {
    throw new ApiErr(
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

// const sendOtp = async (phoneNumber: string, reset = false) => {
//   try {
//     const parsedPhoneNumber = phoneNumber.slice(
//       phoneNumber.length - 10,
//       phoneNumber.length
//     );
//     let userData = await searchOneUser(
//       { phoneNumber: parsedPhoneNumber },
//       false
//     );
//     if (!userData) {
//       if (reset) return false;
//       userData = await new User({ phoneNumber: parsedPhoneNumber }).save();
//     }
//     let createOtp = await OtpModel.findOne({
//       user: userData._id,
//       action: "Verify",
//     });
//     if (createOtp) {
//       createOtp.deleteOne()
//     }
//     createOtp = await new OtpModel({
//       user: userData._id,
//       action: "Verify",
//     }).save();
//     // if (process.env.NODE_ENV != "dev"){
//         const smsHelper = new SmsHelper(parsedPhoneNumber);
//         await smsHelper.sendOTP(createOtp.code);
//         return "کد ورود ارسال شد";
//       // }
//       // return createOtp?.code;
//   } catch (error: any) {
//     console.log(error);
//   }
// };

// const checkOtp = async (phoneNumber: string, code: string, res: Response) => {
//   try {
//     const parsedPhoneNumber = phoneNumber.slice(
//       phoneNumber.length - 10,
//       phoneNumber.length
//     );
//     const userData = (await searchOneUser(
//       { phoneNumber: parsedPhoneNumber },
//       true
//     )) as any;
//     const otpData = await OtpModel.findOneAndRemove({
//       user: userData._id,
//       code,
//     });
//     if (!otpData) {
//       throw new ApiErr(
//         StatusCodes.NOT_FOUND,
//         getReasonPhrase(StatusCodes.NOT_FOUND)
//       );
//     }
//     const now = new Date().getTime();
//     const end = new Date(otpData.createdAt).getTime();
//     if (now > end + 120000)
//       return res.send({ message: "زمان استفاده از کد به پایان رسیده است" });

//     userData.isPhoneVerified = true;
//     const rs = await userData.save();
//     return rs;
//   } catch (error: any) {
//     throw new ApiErr(
//       error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
//       error.message
//     );
//   }
// };

export const setJwtAccessToken = (user: any): string => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  });
};

export function setJwtRefreshToken(user: UserInterface) {
  return jwt.sign(
    {
      _id: user._id,
    },
    (process.env.secret as string) + user.sig,
    { expiresIn: Number(process.env.refreshTokenLife) }
  );
}

function parsePhoneNumber(phone: string) {
  if (phone.startsWith("0"))
    return phone.slice(phone.length - 10, phone.length);

  return phone;
}

export const generateTokens = async (user: any) => {
  const accessToken = setJwtAccessToken(user);
  const refreshToken = RefreshTokenModel.createToken(user);
  return { accessToken, refreshToken };
};

export { searchOneUser, parsePhoneNumber };
