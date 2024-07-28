import mongoose, { Document, ObjectId, Types } from "mongoose";
import { UserInterface } from "../user/user.interface";

export interface PortfolioInterface extends Document {
  _id?: string | mongoose.Types.ObjectId;
  title?: string;
  thumbnail?: string;
  image?: string[];
  content?: string;
  fieldOfActivity?: string;
  date?: Date;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  language?: string;
}
