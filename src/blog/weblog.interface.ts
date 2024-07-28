import mongoose, { Document, ObjectId, Types } from "mongoose";
import { UserInterface } from "../user/user.interface";

export interface WeblogInterface extends Document {
  _id?: string | mongoose.Types.ObjectId;
  title?: string;
  thumbnail?: string;
  image?: string[];
  content?: string;
  status?: "draft" | "published";
  publishedAt?: Date;
  publishedBy?: UserInterface;
  createdBy?: UserInterface;
  createdAt?: Date;
  updatedAt?: Date;
  language?: string;
}
