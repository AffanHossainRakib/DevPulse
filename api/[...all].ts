import app from "../src/app";
import { initDB } from "../src/db";

let dbInitialization: Promise<void> | null = null;

const ensureDatabaseReady = () => {
  if (!dbInitialization) {
    dbInitialization = initDB();
  }

  return dbInitialization;
};

export default async function handler(req: any, res: any) {
  await ensureDatabaseReady();
  return app(req, res);
}
