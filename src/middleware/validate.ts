import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utility/sendResponse";

const requireFields = (...fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const field of fields) {
      if (!req.body[field]) {
        sendResponse(res, {
          statusCode: 400,
          success: false,
          message: `Missing required field: ${field}`,
        });
        return;
      }
    }
    next();
  };
};

export default requireFields;
