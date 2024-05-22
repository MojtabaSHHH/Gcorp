import { Schema, Types, model } from "mongoose";
import {
  UserInterface,
  UserMethodsInterface,
  UserModel,
} from "./user.interface";
import { createRandomStr } from "../utils/RandomStr";
import { ROLES } from "../utils/const";

const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;
const userSchema = new Schema<UserInterface, UserModel, UserMethodsInterface>(
  {
    name: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    sig: {
      type: String,
      default: () => createRandomStr(),
    },
    role: {
      type: String,
      default: ROLES.user,
    },
    ssn: {
      type: String,
    },
    status: {
      type: String,
      default: "active",
    },
    username: {
      type: String,
    },
    password: {
      type: String,
      select: false,
    },
    email: {
      type: String,
      require: true,
    },
    resetPasswordToken: {
      type : String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (e: any) {
    // todo fix any
    console.log(e);
    return next(e);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
  callBack: (error: any, result: boolean) => void // todo fix any
) {
  const user = await User.findOne({ _id: this._id }).select("password");

  if (!user) callBack(Error("کاربری پیدا نشد"), false);
  if (!candidatePassword) callBack(Error("هیچ رمز عبور ارائه نشده است"), false);

  bcrypt.compare(
    candidatePassword,
    user?.password,
    function (err: any, isMatch: boolean) {
      // todo fix any
      if (err) return callBack(err, false);
      return callBack(null, isMatch);
    }
  );
};

const User = model<UserInterface, UserModel>("user", userSchema);

export async function userSeeder() {
  const superUser = await User.findOne({ username: "admin" });
  if (!superUser) {
    const user = new User({
      name: "Mojtaba Shabanzadeh",
      username: process.env.adminUsername,
      phoneNumber: "09117605487",
      email: "mojtabashhh@gmail.com",
      password: process.env.adminPassword,
      role: ROLES.admin,
      ssn: "2580717668",
      status: "active",
    });

    await user.save();
    console.log("admin created");
  }
}
export default User;
