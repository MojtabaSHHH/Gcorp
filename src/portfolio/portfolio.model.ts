import { Schema, Types, model } from "mongoose";
import { PortfolioInterface } from "./portfolio.interface";

const portfolioSchema = new Schema<PortfolioInterface>(
  {
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
    fieldOfActivity: {
      type: String,
    },
    date: {
      type: Date,
    },
    status: {
      type: String,
      default: "diactive",
    },
    language: {
      type: String,
    },
  },
  { timestamps: true }
);

const Portfolio = model<PortfolioInterface>("portfolio", portfolioSchema);

export default Portfolio;
