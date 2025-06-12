import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import RefreshToken from "../models/RefreshTokenModel.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";
const JWT_EXPIRES_IN = "15m";
const JWT_REFRESH_EXPIRES_IN = "7d";

export const register = async (req, res) => {
    console.log("/auth/register called");
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }
        const hash = await bcrypt.hash(password, 10);
        console.log("Hashed password:", hash);
        const user = await User.create({ username, email, password: hash });
        res.status(201).json({ message: "User registered", user: user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    console.log("/auth/login called");
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Wrong password" });

        const accessToken = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });

        await RefreshToken.create({ token: refreshToken, userId: user.id });

        // Set refreshToken as httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true jika di production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
        });

        res.json({ user: user, accessToken, refreshToken });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const refreshToken = async (req, res) => {
    console.log("/auth/refreshToken called");
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No token provided" });

    const stored = await RefreshToken.findOne({ where: { token: refreshToken } });
    if (!stored) return res.status(403).json({ message: "Invalid refresh token" });

    try {
        const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const accessToken = jwt.sign({ userId: payload.userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json({ accessToken });
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};

export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(400).json({ message: "No token provided" });
    await RefreshToken.destroy({ where: { token: refreshToken } });
    res.json({ message: "Logged out" });
};