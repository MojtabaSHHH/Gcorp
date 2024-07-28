import { Schema, Types, model } from "mongoose";
import { WeblogInterface } from "./weblog.interface";

const weblogSchema = new Schema<WeblogInterface>(
  {
    id: {
      type: Number,
    },
    title: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    image: [
      {
        type: String,
      },
    ],
    content: {
      type: String,
    },
    status: {
      type: String,
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
    publishedBy: {
      type: Types.ObjectId,
      ref: "user",
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "user",
    },
    language: {
      type: String,
    },
  },
  { timestamps: true }
);

const Weblog = model<WeblogInterface>("weblog", weblogSchema);

export default Weblog;
