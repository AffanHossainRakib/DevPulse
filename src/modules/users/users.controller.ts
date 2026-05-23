import type { Request, Response } from "express";
import { usersService } from "./users.service.js";
import type { IRequestUser } from "../../types/index.js";
import sendResponse from "../../utility/sendResponse.js";

const getMe = async (req: Request, res: Response) => {
  try {
    const authUser = req.user as IRequestUser | undefined;
    if (!authUser) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized",
      });
    }

    const id = Number(authUser.id);
    const user = await usersService.findById(id);

    if (!user) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    }

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (err: unknown) {
    const error = err as {
      status?: number;
      message?: string;
      errors?: unknown;
    };
    return sendResponse(res, {
      statusCode: error.status || 500,
      success: false,
      message: error.message || "Failed to retrieve user",
      error: error.errors ?? null,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await usersService.findById(id);
    if (!user)
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (err: unknown) {
    const error = err as {
      status?: number;
      message?: string;
      errors?: unknown;
    };
    return sendResponse(res, {
      statusCode: error.status || 500,
      success: false,
      message: error.message || "Failed to retrieve user",
      error: error.errors ?? null,
    });
  }
};

export const userController = {
  getMe,
  getUserById,
};
