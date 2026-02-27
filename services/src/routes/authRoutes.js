import { Router } from "express";
import { login } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

// Public route
router.post("/login", login);

// Protected route (applying the middleware before the inline response)
router.get("/secure-data", verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}!` });
});

export default router;
