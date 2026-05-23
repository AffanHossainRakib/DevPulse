import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { authService } from "./auth.service";

const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await authService.createUser({ name, email, password, role });
    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err: any) {
    return sendResponse(res, {
      statusCode: err.status || 400,
      success: false,
      message: err.message || "Signup failed",
      error: err.errors ?? null,
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.authenticateUser(email, password);

    if (result.refreshToken) {
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
    }

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: {
        token: result.accessToken,
        user: result.user,
      },
    });
  } catch (err: any) {
    return sendResponse(res, {
      statusCode: err.status || 400,
      success: false,
      message: err.message || "Login failed",
      error: err.errors ?? null,
    });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;
    const result = await authService.generateFreshToken(token);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Access token generated",
      data: result,
    });
  } catch (err: any) {
    return sendResponse(res, {
      statusCode: err.status || 401,
      success: false,
      message: err.message || "Invalid refresh token",
    });
  }
};

export const authController = {
  signup,
  login,
  refreshToken,
};
