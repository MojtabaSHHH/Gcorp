import { body } from "express-validator";
import User from "../user/user.model";

export const update = [
  body("name")
    .isString()
    .optional()
    .custom((value) => {
      if (!value.match(/^[\u0600-\u06FF\s]+$/)) {
        throw new Error("نام باید فاقد شماره یا کاراکتر خاص باشد");
      }
    }),
  body("phoneNumber")
    .isString()
    .optional()
    .custom((value) => {
      if (/^\d+$/.test(value)) {
        throw new Error("شماره تماس باید فاقد حروف یا کاراکتر خاص باشد");
      }
    }),
  body("ssn")
    .isString()
    .optional()
    .custom((value) => {
      if (value.length !== 10) {
        throw new Error("کد ملی باید 10 رفم باشد");
      }
    }),
  body("password").isString().optional(),
  body("email").isEmail().optional().withMessage("ایمیل باید معتبر باشد"),
];

export const create = [
  body("name").isString(),
  body("phoneNumber")
    .isString()
    .custom((value) => {
      return User.findOne({ phoneNumber: value }).then(function (user) {
        if (user) {
          throw new Error("کاربری با این شماره همراه وجود دارد");
        }
      });
    }),
  body("ssn")
    .isNumeric()
    .custom((value) => {
      return User.findOne({ ssn: value }).then(function (user) {
        if (user) {
          throw new Error("کاربری با این کد ملی وجود دارد");
        }
      });
    }),
  body("email")
    .isEmail()
    .withMessage("ایمیل باید معتبر باشد")
    .custom((value) => {
      return User.findOne({ email: value }).then(function (user) {
        if (user) {
          throw new Error("کاربری با این ایمیل وجود دارد");
        }
      });
    }),
];
