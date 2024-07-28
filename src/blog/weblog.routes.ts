import express from "express";
import {
    createWeblogController,
    deleteWeblogController,
    getAllWeblogsController,
    getWeblogByIdController,
    updateWeblogController,
} from "./weblog.controller";
import { checkPerm } from "../utils/auth";
import imageUpload from "../utils/upload";

const router = express.Router();

router.post("/", checkPerm(["admin"]), imageUpload.single('image'), createWeblogController);

router.get("/:id", getWeblogByIdController);

router.put("/:id", checkPerm(["admin"]), imageUpload.single('image'), updateWeblogController);

router.delete("/:id", checkPerm(["admin"]), deleteWeblogController);

router.get("/", getAllWeblogsController);

export default router;
