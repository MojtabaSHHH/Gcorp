import { Request, Response } from "express";
import catchAsync from "../middleware/catchAsync";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import {
  createPortfolioService,
  deletePortfolioService,
  getAllPortfolioService,
  getPortfolioByIdService,
  updatePortfolioService,
} from "./portfolio.service";
import { PortfolioInterface } from "./portfolio.interface";

export const getAllPortfolioController = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const { query, page, limit, sort, language, ...filter } = req.query;

      const portfolio = await getAllPortfolioService({
        query,
        page,
        limit,
        sort,
        status: filter.status,
        language,
      });

      res.json(portfolio);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Internal server error", data: [], count: 0 });
    }
  }
);

export const getPortfolioByIdController = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const PortfolioId = req.params.id;
      const { language } = req.query;

      const Portfolio = await getPortfolioByIdService(
        PortfolioId,
        language as string
      );

      if (!Portfolio) {
        res.status(404).json({ error: "Portfolio not found" });
        return;
      }

      res.json(Portfolio);
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: "Portfolio not found" });
    }
  }
);

export const createPortfolioController = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const portfolioId = new mongoose.Types.ObjectId();

      const portfolioDataEn: PortfolioInterface = {
        ...req.body,
        language: "en",
        id: portfolioId,
        createdBy: req.user?._id,
      };

      const portfolioDataFa: PortfolioInterface = {
        ...req.body,
        language: "fa",
        id: portfolioId,
        createdBy: req.user?._id,
      };

      if (req.file) {
        portfolioDataEn.image = req.file.filename;
        portfolioDataFa.image = req.file.filename;
      }

      const [newPortfolioEn, newPortfolioFa] = await Promise.all([
        createPortfolioService(portfolioDataEn),
        createPortfolioService(portfolioDataFa),
      ]);

      res.status(201).json({ english: newPortfolioEn, farsi: newPortfolioFa });
    } catch (error) {
      res.status(422).json({ error: "Portfolio creation failed" });
    }
  }
);

export const updatePortfolioController = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const portfolioId = req.params.id;
      const portfolioData = req.body;
      const userId = req.user._id;

      if (req.file) {
        portfolioData.image = req.file.filename;
      }

      if (portfolioData.status === "published") {
        portfolioData.publishedBy = userId;
        portfolioData.publishedAt = new Date(Date.now());
      }

      const portfolioDataEn = { ...portfolioData, language: "en" };
      const portfolioDataFa = { ...portfolioData, language: "fa" };

      const [updatedPortfolioEn, updatedPortfolioFa] = await Promise.all([
        updatePortfolioService(portfolioId, portfolioDataEn),
        updatePortfolioService(portfolioId, portfolioDataFa),
      ]);

      console.log({ updatedPortfolioEn, updatedPortfolioFa });

      if (!updatedPortfolioEn && !updatedPortfolioFa) {
        res.status(404).json({ error: "Portfolio not found" });
        return;
      }

      res.json({ english: updatedPortfolioEn, farsi: updatedPortfolioFa });
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: "Portfolio not found" });
    }
  }
);

export const updatePortfolioStatusController = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const portfolioId = req.params.id;
      const status = req.body.status;

      if (status !== "active" && status !== "deactive") {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send({ error: "وضعیت درست نیست" });
      }

      const updateData: any = { status };

      const [updatedPortfolioEn, updatedPortfolioFa] = await Promise.all([
        updatePortfolioService(portfolioId, {
          ...updateData,
          language: "en",
        }),
        updatePortfolioService(portfolioId, {
          ...updateData,
          language: "fa",
        }),
      ]);

      if (!updatedPortfolioEn && !updatedPortfolioFa) {
        return res.status(404).json({ error: "Portfolio not found" });
      }

      res.json({ english: updatedPortfolioEn, farsi: updatedPortfolioFa });
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: "Portfolio not found" });
    }
  }
);

export const deletePortfolioController = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const PortfolioId = req.params.id;
      const deletedPortfolio = await deletePortfolioService(PortfolioId);

      if (!deletedPortfolio) {
        res.status(404).json({ error: "Portfolio not found" });
        return;
      }

      res.json(deletedPortfolio);
    } catch (error) {
      res.status(404).json({ error: "Portfolio not found" });
    }
  }
);
