import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
const createRandomStr = (input = Number(process.env.SIG_LEN) ?? 16) => {
  return crypto.randomBytes(input).toString("hex");
};
const createRandomNumber = (input = 6) => {
  const numbers = "0123456789";
  let result = "";
  for (let index = 0; index < input; index++) {
    result += numbers[Math.floor(Math.random() * 10)].toString();
  }

  return result;
};
export { createRandomStr, createRandomNumber };
