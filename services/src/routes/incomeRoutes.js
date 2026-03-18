import express from "express";
import { createIncome, getIncomes, updateIncome } from "../controllers/incomeController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getIncomes);
router.post("/", verifyToken, createIncome);
router.put("/:id", verifyToken, updateIncome);

export default router;
