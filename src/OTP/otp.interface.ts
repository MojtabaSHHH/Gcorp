import { Document } from "mongoose";
export interface opt extends Document {
  action: string;
  code: string;
  user: any; // todo fix any
  createdAt: Date;
}
export interface _opt extends Document {
  action: string;
  code: string;
  user: any; // todo fix any
  createdAt: Date;
}
