import express from "express";
import { getBalance, transferAmount } from "../controllers/account.js";
import { authMiddleware } from "../middleware/is-auth.js";

const router = express.Router();

router.get("/balance", authMiddleware, getBalance);
router.post("/transfer", authMiddleware, transferAmount);

export default router;
