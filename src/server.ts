import app from "./app";
import { initDB } from "./db";
import config from "./config";

const main = async () => {
  await initDB();
  app.listen(Number(config.port), () => {
    console.log(`Server listening on http://localhost:${config.port}`);
  });
};

main();
