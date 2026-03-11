import express from "express";
import { getRatesByContinent, updateRatesByContinent } from "../controllers/rateController.js";

const router = express.Router();

router.get("/:continent", getRatesByContinent);
router.post("/:continent", updateRatesByContinent);

export default router;