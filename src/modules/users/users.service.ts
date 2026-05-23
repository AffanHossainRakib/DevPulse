import { pool } from "../../db/index.js";
import type { IUser } from "./users.interface.js";

const findById = async (id: number): Promise<IUser | null> => {
  const res = await pool.query(
    `SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1`,
    [id],
  );
  return res.rows[0] || null;
};

const findByEmail = async (email: string): Promise<IUser | null> => {
  const res = await pool.query(
    `SELECT id, name, email, role, created_at, updated_at FROM users WHERE email = $1`,
    [email],
  );
  return res.rows[0] || null;
};

export const usersService = {
  findById,
  findByEmail,
};
