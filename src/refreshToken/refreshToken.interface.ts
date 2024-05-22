import { Document, Model } from "mongoose";
import { UserInterface } from "../user/user.interface";
export interface RefreshTokenDocument extends Document {
  _id?: string;
  token: string;
  user: UserInterface;
  expiryDate: Date;
}

//static methods
export interface _RefreshToken extends Model<RefreshTokenDocument> {
  createToken(user: UserInterface): string;
  verifyExpiration(token: RefreshTokenDocument): boolean;
}
