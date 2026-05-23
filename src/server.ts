import app from "./app";
import { initDB } from "./db";
import config from "./config";

const main = async () => {
  await initDB();
  app.listen(Number(config.PORT), () => {
    console.log(`Server listening on http://localhost:${config.PORT}`);
  });
};

main();
