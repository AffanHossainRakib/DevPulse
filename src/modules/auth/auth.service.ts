import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import type { INewUser } from "./auth.interface";
import { pool } from "../../db";

const createUser = async ({ name, email, password, role }: INewUser) => {
  const existing = await pool.query(`SELECT id FROM users WHERE email = $1`, [
    email,
  ]);

  if (existing.rows[0]) {
    const err: any = new Error("Email already registered");
    err.status = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, config.SALT_ROUNDS);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES ($1,$2,$3,COALESCE($4, 'contributor'),now(),now()) RETURNING *`,
    [name, email, hashed, role],
  );

  delete result.rows[0].password;
  return result.rows[0];
};

const findUserByEmail = async (email: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  return result.rows[0];
};

const authenticateUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    const err: any = new Error("Invalid credentials");
    err.status = 400;
    throw err;
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    const err: any = new Error("Invalid credentials");
    err.status = 400;
    throw err;
  }

  const payload = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, config.secret as string, {
    expiresIn: "7d",
  });

  const refreshToken = jwt.sign(payload, config.refresh_secret as string, {
    expiresIn: "14d",
  });

  if (user && user.password) delete user.password;

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const generateFreshToken = async (token: string) => {
  if (!token) {
    const err: any = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }

  try {
    const decoded = jwt.verify(token, config.refresh_secret as string) as
      | jwt.JwtPayload
      | string;
    if (typeof decoded === "string") {
      const err: any = new Error("Invalid token payload");
      err.status = 401;
      throw err;
    }

    const userRes = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      decoded.email,
    ]);

    if (!userRes.rows[0]) {
      const err: any = new Error("User not found");
      err.status = 404;
      throw err;
    }

    delete userRes.rows[0]?.password;
    const user = userRes.rows[0];
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
    };
    const accessToken = jwt.sign(payload, config.secret as string, {
      expiresIn: "7d",
    });
    return { accessToken };
  } catch (e: any) {
    const err: any = new Error(e.message || "Invalid token");
    err.status = 401;
    throw err;
  }
};

export const authService = {
  createUser,
  authenticateUser,
  generateFreshToken,
  findUserByEmail,
};
