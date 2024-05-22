import mongoose, { model, Schema } from "mongoose";
import { _RefreshToken, RefreshTokenDocument } from "./refreshToken.interface";
import { setJwtRefreshToken } from "../auth/auth.service";
import jwt from "jsonwebtoken";
import ApiErr from "../utils/ApiErr";
import { StatusCodes } from "http-status-codes";
const RefreshTokenSchema = new Schema<RefreshTokenDocument>({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expiryDate: Date,
});

RefreshTokenSchema.statics.createToken = async function (user) {
  const expiredAt = new Date();
  const _token = setJwtRefreshToken(user);

  expiredAt.setSeconds(
    expiredAt.getSeconds() + Number(process.env.refreshTokenLife)
  );
  const _object = new this({
    token: _token,
    user: user._id,
    expiryDate: expiredAt.getTime(),
  });

  const refreshToken = await _object.save();

  return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = (token: RefreshTokenDocument) => {
  return jwt.verify(
    token.token,
    (process.env.secret as string) + token.user.sig,
    function (error: any, decoded: any) {
      // todo fix any
      if (error) {
        new ApiErr(error.statusCode || StatusCodes.UNAUTHORIZED, error);
        return false;
      }
      return true;
    }
  );
};

const RefreshTokenModel: _RefreshToken = model<
  RefreshTokenDocument,
  _RefreshToken
>("RefreshToken", RefreshTokenSchema);
module.exports = RefreshTokenModel;
export default RefreshTokenModel;
