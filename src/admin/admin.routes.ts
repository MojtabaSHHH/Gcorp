import express from "express";
import validator from "../utils/validator";
import { checkPerm } from "../utils/auth";
import { create, update } from "./admin.validate";
import {
  createAdminController,
  getAdminsController,
  getAll,
  updateAdminController,
} from "./admin.controller";

const router = express.Router();

router.post("/", validator(create), createAdminController);

router.get("/", getAdminsController);

router.get("/all", checkPerm(["admin"]), getAll);

router.put("/:id", validator(update),updateAdminController);

export default router;
