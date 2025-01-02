import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import "express-async-errors";
import "dotenv/config";
import { router as authRouter } from "./app/routes/authRoutes.js";
import { router as userRouter } from "./app/routes/userRoutes.js";
import connectToMongoDB from "./app/configuration/mongoDBconn.js";
import subscriptionRoutes from "./app/routes/subscriptionRoutes.js";
import planRoutes from "./app/routes/planRoutes.js";
import { notFound as notFoundMiddleware } from "./app/middleware/not-found.js";
import { errorHandlerMiddleware } from "./app/middleware/error-handler.js";

const app = express();

// Create a write stream for logs
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logStream = fs.createWriteStream(path.join(__dirname, "sma.log"), {
  flags: "a",
}); // Append logs to the file "sma.log"
app.use(morgan("combined", { stream: logStream }));
app.use(helmet());
// Enable trust proxy to correctly handle X-Forwarded-For header
app.use("trust proxy", 1);
// Rate limiting security functionality
let limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message:
    "We have received too many requests from this IP. Please try again after one hour.",
});
app.use(cors());

app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/plans", planRoutes);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectToMongoDB(process.env.MONGO_URI);
    console.log("CONNECTED TO THE DB...");
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (err) {
    console.log("DB Connection Error: ", err);
    process.exit(1);
  }
};

start();