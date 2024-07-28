import { WeblogInterface } from "./weblog.interface";
import Weblog from "./weblog.model";

export const getAllWeblogService = async (query: any) => {
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

  const data = await Weblog.find(filter, undefined, pagination).sort(
    sortOptions
  );

  const count = await Weblog.countDocuments(filter);

  return {
    data,
    count,
  };
};

export const getWeblogByIdService = async (id: string, language?: string) => {
  const queryOptions: any = {
    _id: id,
    ...(language && { language }),
  };

  return await Weblog.findOne(queryOptions).exec();
};

export const createWeblogService = async (weblogData: WeblogInterface) => {
  console.log({ weblogData });

  return await Weblog.create(weblogData);
};

export const updateWeblogService = async (
  id: string,
  weblogData: WeblogInterface
) => {
  return await Weblog.findByIdAndUpdate(id, weblogData, { new: true });
};

export const deleteWeblogService = async (id: string) => {
  return await Weblog.findByIdAndDelete(id);
};
