import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./modules/auth/auth.route.js";
import issuesRouter from "./modules/issues/issues.route.js";
import usersRouter from "./modules/users/users.route.js";
import { requestLogger } from "./middleware/logger.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "DevPulse API is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/issues", issuesRouter);
app.use("/api/users", usersRouter);

app.use(globalErrorHandler);

export default app;
