import { PortfolioInterface } from "./portfolio.interface";
import Portfolio from "./portfolio.model";

export const getAllPortfolioService = async (query: any) => {
  const filter: any = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.language) {
    filter.language = query.language;
  }

  if (query.query) {
    filter.$or = [
      {
        title: { $regex: new RegExp(query.query?.toLowerCase(), "i") },
      },
    ];
  }

  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;

  const pagination = {
    limit,
    skip: (page - 1) * limit,
  };

  const sortOptions: any = {
    createdAt: -1,
  };

  const data = await Portfolio.find(filter, undefined, pagination).sort(
    sortOptions
  );

  const count = await Portfolio.countDocuments(filter);

  return {
    data,
    count,
  };
};

export const getPortfolioByIdService = async (
  id: string,
  language?: string
) => {
  const queryOptions: any = {
    _id: id,
    ...(language && { language }),
  };

  return await Portfolio.findOne(queryOptions).exec();
};

export const createPortfolioService = async (
  portfolioData: PortfolioInterface
) => {
  console.log({ portfolioData });

  return await Portfolio.create(portfolioData);
};

export const updatePortfolioService = async (
  id: string,
  portfolioData: PortfolioInterface
) => {
  return await Portfolio.findByIdAndUpdate(id, portfolioData, { new: true });
};

export const deletePortfolioService = async (id: string) => {
  return await Portfolio.findByIdAndDelete(id);
};
