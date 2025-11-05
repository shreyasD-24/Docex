import e, { Router } from "express";
import { generateIce } from "../controllers/ice.js";

const iceRouter = Router();

iceRouter.get("/", generateIce);

export default iceRouter;
