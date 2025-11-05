import { Router } from "express";
import genRouter from "./gen-ai.js";
import iceRouter from "./ice.js";

const router = Router();

router.use("/gen-ai", genRouter);
router.use("/ice", iceRouter);

export default router;
