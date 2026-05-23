import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT ?? "5000";
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

export default {
  PORT,
  DATABASE_URL,
  JWT_SECRET,
  SALT_ROUNDS,
};
