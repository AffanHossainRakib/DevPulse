import type { Request, Response } from "express";
import { issuesService } from "./issues.service";
import type { IRequestUser } from "../../types";
import sendResponse from "../../utility/sendResponse";

const createIssue = async (req: Request, res: Response) => {
  try {
    const user = req.user as IRequestUser;
    if (!user)
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized",
      });
    
    const reporter_id = user.id;
    const { title, description, type } = req.body;
    const issue = await issuesService.createIssue({
      title,
      description,
      type,
      reporter_id,
    });
    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: issue,
    });
  } catch (err: unknown) {
    const error = err as {
      status?: number;
      message?: string;
      errors?: unknown;
    };
    return sendResponse(res, {
      statusCode: error.status || 400,
      success: false,
      message: error.message || "Create failed",
      error: error.errors ?? null,
    });
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const issues = await issuesService.getAllIssues(req.query);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrived successfully",
      data: issues,
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
      message: error.message || "Failed",
      error: error.errors ?? null,
    });
  }
};

const getIssueById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const issue = await issuesService.getIssueById(id);
    if (!issue)
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Not found",
      });
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue retrived successfully",
      data: issue,
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
      message: error.message || "Failed",
      error: error.errors ?? null,
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = req.user as IRequestUser;
    if (!user) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized",
      });
    }

    const payload = req.body;
    const updated = await issuesService.updateIssue(id, user, payload);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: updated,
    });
  } catch (err: unknown) {
    const error = err as {
      status?: number;
      message?: string;
      errors?: unknown;
    };
    return sendResponse(res, {
      statusCode: error.status || 400,
      success: false,
      message: error.message || "Update failed",
      error: error.errors ?? null,
    });
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = req.user as IRequestUser;
    if (!user) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized",
      });
    }

    await issuesService.deleteIssue(id, user);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (err: unknown) {
    const error = err as {
      status?: number;
      message?: string;
      errors?: unknown;
    };
    return sendResponse(res, {
      statusCode: error.status || 400,
      success: false,
      message: error.message || "Delete failed",
      error: error.errors ?? null,
    });
  }
};

export const issuesController = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
};
