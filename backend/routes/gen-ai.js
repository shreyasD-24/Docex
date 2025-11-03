import { Router } from "express";
import {
  generateContent,
  generateEdit,
  generateExplanation,
} from "../controllers/gen-ai.js";

const genRouter = Router();

genRouter.post("/edit", generateEdit);
genRouter.post("/ask", generateExplanation);
genRouter.post("/generate", generateContent);

export default genRouter;
