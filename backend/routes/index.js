import { Router } from "express";
import genRouter from "./gen-ai.js";

const router = Router();

router.use("/gen-ai", genRouter);

export default router;
