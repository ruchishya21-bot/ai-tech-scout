import express from "express";
import {
  createResearch,
  getAllResearch,
  getResearchById,
  deleteResearch,
} from "../controllers/researchController";

const router = express.Router();

router.post("/", createResearch);

router.get("/", getAllResearch);

router.get("/:id", getResearchById);

router.delete("/:id", deleteResearch);

export default router;