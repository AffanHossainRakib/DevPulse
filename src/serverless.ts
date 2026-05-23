import app from "./app.js";
import { initDB } from "./db/index.js";

let dbInitialized = false;

const serverlessHandler = async (req: any, res: any) => {
  if (!dbInitialized) {
    await initDB();
    dbInitialized = true;
  }

  return app(req, res);
};

export default serverlessHandler;
