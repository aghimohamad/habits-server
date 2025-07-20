import express from "express";
import { PORT } from "./config/env.ts";
import habitRouter from "./routes/habit.routes.ts";
import authRouter from "./routes/auth.routes.ts";
import connectToDatabase from "./databse/mongoose.ts";
import errorMiddleware from "./middleware/error.middleware.ts";
import cookieParser from "cookie-parser";
import cors from "cors";
import logRouter from "./routes/log.route.ts";
const app = express();

const allowedOrigins = [
  "http://localhost:8081", // For local development
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // if you use cookies or authentication
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1/habits", habitRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/logs", logRouter);
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`started server on PORT ${PORT}`);

  await connectToDatabase();
});

export default app;
