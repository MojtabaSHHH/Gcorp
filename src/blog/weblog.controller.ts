import { Request, Response } from "express";
import catchAsync from "../middleware/catchAsync";
import { WEBLOG_SERVICE } from ".";
import { StatusCodes } from "http-status-codes";
import { responseGenerator } from "../utils/response";
import { WeblogInterface } from "./weblog.interface";
import mongoose from "mongoose";

export const getAllWeblogsController = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const { query, page, limit, sort, language, ...filter } = req.query;

      const Weblogs = await WEBLOG_SERVICE.getAllWeblogService({
        query,
        page,
        limit,
        sort,
        status: filter.status,
        language,
      });

      res.json(Weblogs);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Internal server error", data: [], count: 0 });
    }
  }
);

export const getWeblogByIdController = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const WeblogId = req.params.id;
      const { language } = req.query;

      const Weblog = await WEBLOG_SERVICE.getWeblogByIdService(
        WeblogId,
        language as string
      );

      if (!Weblog) {
        res.status(404).json({ error: "Weblog not found" });
        return;
      }

      res.json(Weblog);
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: "Weblog not found" });
    }
  }
);

export const createWeblogController = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const weblogId = new mongoose.Types.ObjectId();

      const weblogDataEn: WeblogInterface = {
        ...req.body,
        language: "en",
        id: weblogId,
        createdBy: req.user?._id,
      };

      const weblogDataFa: WeblogInterface = {
        ...req.body,
        language: "fa",
        id: weblogId,
        createdBy: req.user?._id,
      };

      if (req.file) {
        weblogDataEn.image = req.file.filename;
        weblogDataFa.image = req.file.filename;
      }

      const [newWeblogEn, newWeblogFa] = await Promise.all([
        WEBLOG_SERVICE.createWeblogService(weblogDataEn),
        WEBLOG_SERVICE.createWeblogService(weblogDataFa),
      ]);

      res.status(201).json({ english: newWeblogEn, farsi: newWeblogFa });
    } catch (error) {
      res.status(422).json({ error: "Weblog creation failed" });
    }
  }
);

export const updateWeblogController = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const weblogId = req.params.id;
      const weblogData = req.body;
      const userId = req.user._id;

      if (req.file) {
        weblogData.image = req.file.filename;
      }

      if (weblogData.status === "published") {
        weblogData.publishedBy = userId;
        weblogData.publishedAt = new Date(Date.now());
      }

      const weblogDataEn = { ...weblogData, language: "en" };
      const weblogDataFa = { ...weblogData, language: "fa" };

      const [updatedWeblogEn, updatedWeblogFa] = await Promise.all([
        WEBLOG_SERVICE.updateWeblogService(weblogId, weblogDataEn),
        WEBLOG_SERVICE.updateWeblogService(weblogId, weblogDataFa),
      ]);

      console.log({ updatedWeblogEn, updatedWeblogFa });

      if (!updatedWeblogEn && !updatedWeblogFa) {
        res.status(404).json({ error: "Weblog not found" });
        return;
      }

      res.json({ english: updatedWeblogEn, farsi: updatedWeblogFa });
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: "Weblog not found" });
    }
  }
);

export const updateWeblogStatusController = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const weblogId = req.params.id;
      const status = req.body.status;

      if (status !== "draft" && status !== "published") {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send({ error: "وضعیت درست نیست" });
      }

      const updateData: any = { status };

      const [updatedWeblogEn, updatedWeblogFa] = await Promise.all([
        WEBLOG_SERVICE.updateWeblogService(weblogId, {
          ...updateData,
          language: "en",
        }),
        WEBLOG_SERVICE.updateWeblogService(weblogId, {
          ...updateData,
          language: "fa",
        }),
      ]);

      if (!updatedWeblogEn && !updatedWeblogFa) {
        return res.status(404).json({ error: "Weblog not found" });
      }

      res.json({ english: updatedWeblogEn, farsi: updatedWeblogFa });
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: "Weblog not found" });
    }
  }
);

export const deleteWeblogController = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const WeblogId = req.params.id;
      const deletedWeblog = await WEBLOG_SERVICE.deleteWeblogService(WeblogId);

      if (!deletedWeblog) {
        res.status(404).json({ error: "Weblog not found" });
        return;
      }

      res.json(deletedWeblog);
    } catch (error) {
      res.status(404).json({ error: "Weblog not found" });
    }
  }
);
