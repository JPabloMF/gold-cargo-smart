import express from "express";
import { getQuoteCount, incrementQuoteCount } from "../controllers/quoteStatController.js";

const router = express.Router();

router.get("/count", getQuoteCount);
router.post("/count", incrementQuoteCount);

export default router;
