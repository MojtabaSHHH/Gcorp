import express from "express";
import { checkPerm } from "../utils/auth";
import imageUpload from "../utils/upload";
import {
  createPortfolioController,
  getPortfolioByIdController,
  deletePortfolioController,
  getAllPortfolioController,
  updatePortfolioController,
} from "./portfolio.controller";

const router = express.Router();

router.post(
  "/",
  checkPerm(["admin"]),
  imageUpload.single("image"),
  createPortfolioController
);

router.get("/:id", getPortfolioByIdController);

router.put(
  "/:id",
  checkPerm(["admin"]),
  imageUpload.single("image"),
  updatePortfolioController
);

router.delete("/:id", checkPerm(["admin"]), deletePortfolioController);

router.get("/", getAllPortfolioController);

export default router;
