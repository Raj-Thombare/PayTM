import express from "express";
import { signUp, signIn, updateUser, searchUser } from "../controllers/user.js";
import { authMiddleware } from "../middleware/is-auth.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.put("/", authMiddleware, updateUser);

router.get("/bulk", searchUser);

export default router;