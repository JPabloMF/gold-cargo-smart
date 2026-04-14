import express from "express";
import { getQuoteCount, incrementQuoteCount } from "../controllers/quoteStatController.js";
import { getQuotes, createQuote } from "../controllers/quoteController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getQuotes);
router.post("/", createQuote);
router.get("/count", getQuoteCount);
router.post("/count", incrementQuoteCount);

export default router;
