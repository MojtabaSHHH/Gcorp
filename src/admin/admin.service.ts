import { StatusCodes, getReasonPhrase } from "http-status-codes";
import User from "../user/user.model";
import ApiErr from "../utils/ApiErr";
import { ROLES } from "../utils/const";
import _ from "lodash";
import { UserInterface } from "../user/user.interface";

export const createAdminService = async (body: any) => {
  try {
    const user: any = await new User({
      ...body,
    });
    await user.save();
    return user;
  } catch (error: any) {
    console.error(error);
    throw new ApiErr(
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      getReasonPhrase(StatusCodes.NOT_FOUND)
    );
  }
};

export const updateAdminService = async (id: any, reqUser: any) => {
  const user = await User.findById(id);
  if (user)
    Object.keys(reqUser).map((key) => {
      (user as any)[key] = reqUser[key];
    });
  await user?.save();
  return user;
};

export async function getAdminsService(query: any) {
  // todo fix any
  const filter: any = {}; // todo fix any

  Object.keys(query).map(async (key) => {
    if (key === "role") {
      filter.$and = [
        ...(filter.$and || []),
        {
          role: {
            $in: Array.isArray(query.role) ? [...query.role] : [query.role],
          },
        },
      ];
      return;
    }
    if (key === "status") {
      filter.$and = [
        ...(filter.$and || []),
        {
          status: {
            $in: Array.isArray(query.status)
              ? [...query.status]
              : [query.status],
          },
        },
      ];
      return;
    }
  });
  if (query.query) {
    filter.$or = [
      {
        name: { $regex: new RegExp(query.query?.toLowerCase(), "i") },
      },
      {
        lastName: { $regex: new RegExp(query.query?.toLowerCase(), "i") },
      },
      {
        username: { $regex: new RegExp(query.query?.toLowerCase(), "i") },
      },
      {
        ssn: { $regex: new RegExp(query.query?.toLowerCase(), "i") },
      },
      {
        phoneNumber: { $regex: new RegExp(query.query?.toLowerCase(), "i") },
      },
      {
        role: { $regex: new RegExp(query.query?.toLowerCase(), "i") },
      },
      {
        email: { $regex: new RegExp(query.query?.toLowerCase(), "i") },
      },
    ];
  }

  const queryFilters = {
    ...filter,
    role: { $ne: ROLES.user },
  };

  const page = query.page || 1;
  const limit = query.limit || 10;

  const pagination = {
    limit,
    skip: (page - 1) * limit,
  };

  const data = await User.find(queryFilters, undefined, pagination).sort({
    createdAt: -1,
  });

  const count = await User.countDocuments(queryFilters);

  return {
    data,
    count,
  };
}

export async function getAllUsers(query: any, user: UserInterface) {
  const isAdmin = user.role === ROLES.admin;
  const filter: any = {}; // todo fix any

  Object.keys(query).map(async (key) => {
    if (key === "status") {
      filter.$and = [
        ...(filter.$or || []),
        {
          status: {
            $in: Array.isArray(query.status)
              ? [...query.status]
              : [query.status],
          },
        },
      ];
      return;
    }
  });

  if (query.query) {
    filter.$or = [
      {
        name: { $regex: new RegExp(query.query?.toLowerCase(), "i") },
      },
      {
        lastName: { $regex: new RegExp(query.query?.toLowerCase(), "i") },
      },
      {
        username: { $regex: new RegExp(query.query?.toLowerCase(), "i") },
      },
      {
        ssn: { $regex: new RegExp(query.query?.toLowerCase(), "i") },
      },
      {
        phoneNumber: { $regex: new RegExp(query.query?.toLowerCase(), "i") },
      },
      {
        role: { $regex: new RegExp(query.query?.toLowerCase(), "i") },
      },
      {
        email: { $regex: new RegExp(query.query?.toLowerCase(), "i") },
      },
    ];
  }

  const queryFilters = { ...filter, role: ROLES.user };

  const page = query.page || 1;
  const limit = query.limit || 10;

  const pagination = {
    limit,
    skip: (page - 1) * limit,
  };
  const data = await User.find(queryFilters, undefined, pagination)
    .sort({
      createdAt: -1,
    })
    .populate("product");

  const count = await User.countDocuments(queryFilters);

  return {
    data,
    count,
  };
}
