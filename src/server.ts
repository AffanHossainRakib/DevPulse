import app from "./app.js";
import { initDB } from "./db/index.js";
import config from "./config/index.js";

const main = async () => {
  await initDB();
  app.listen(Number(config.port), () => {
    console.log(`Server listening on http://localhost:${config.port}`);
  });
};

main();
