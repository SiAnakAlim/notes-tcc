import express from "express";
import { register, login, refreshToken, logout, getMe } from "../controllers/AuthController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refreshToken", refreshToken);
router.post("/logout", logout);
router.get("/me", getMe);


export default router;