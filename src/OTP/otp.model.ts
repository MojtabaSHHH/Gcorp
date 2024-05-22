import { Schema, model, Types, Model } from "mongoose";
import { createRandomNumber } from "../utils/RandomStr";
import { opt } from "./otp.interface";
const otpSchema = new Schema<opt>(
  {
    action: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      default: () => createRandomNumber(4),
    },
    user: {
      type: Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
const OtpModel: Model<opt> = model<opt>("otp", otpSchema);
export default OtpModel;
