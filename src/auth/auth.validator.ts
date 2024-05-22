import { body } from "express-validator";
export const loginWithEmail = [
  body("email").isEmail().withMessage("لطفا یک ایمیل معتبر وارد کنید"),
  body("password").isString().withMessage("رمز عبور باید یک رشته معتبر باشد"),
];

export const resetPassword = [
  body("email").isEmail().withMessage("لطفا یک ایمیل معتبر وارد کنید"),
  body("password").isString().withMessage("رمز عبور باید یک رشته معتبر باشد"),
];

