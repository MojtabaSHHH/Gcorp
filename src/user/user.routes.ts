import express from "express";
import {
  getOne,
  getOneWithId,
  updateById,
  createOne,
} from "./user.controller";
import { create, update } from "./user.validate";
import validator from "../utils/validator";
import UserAuthMiddleware from "../middleware/UserAuthMiddleware";
import { checkPerm } from "../utils/auth";

const router = express.Router();

router.post("/one", validator(create), createOne);

router.get("/one", UserAuthMiddleware, /*checkPerm(["admin"]),*/ getOne);

router.put("/:id", checkPerm(["admin"]), updateById);

router.get("/:id", getOneWithId);

router.put("/:id", validator(update), updateById);

export default router;
