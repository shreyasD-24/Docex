import express from "express";
import cors from "cors";
import { config } from "dotenv";
import apiRouter from "./routes/index.js";
config({ quiet: true });
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/v1", apiRouter);

export default app;
