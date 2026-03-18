import express from "express";
import { getAllRates, getRatesByContinent, updateRatesByContinent } from "../controllers/rateController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllRates);
router.get("/:continent", getRatesByContinent);
// Apply verifyToken middleware to the update route
router.post("/:continent", verifyToken, updateRatesByContinent);

export default router;