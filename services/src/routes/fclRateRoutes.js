import express from "express";
import { getFclRates, updateFclRates } from "../controllers/fclRateController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getFclRates);
router.post("/", verifyToken, updateFclRates);

export default router;
