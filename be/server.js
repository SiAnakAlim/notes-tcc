import express from "express";
import cors from "cors";
import db from "./config/database.js";
import NoteRoutes from "./routes/NoteRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// tampilkan cek isi env
console.log("host db", process.env.DB_HOST);

app.use(cookieParser());
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5500",    // contoh Live Server VSCode
  "http://127.0.0.1:5500",
  "http://localhost:3000",    // jika FE juga di port 3000
  "null",
  "file:///D:/node_js_mase/Notes-aryamukti/fe/index.html"                    // jika buka file langsung (file://)
];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Routes
app.use("/api", NoteRoutes);
app.use("/auth", authRoutes);


// Database Connection
(async () => {
  try {
    await db.authenticate();
    console.log("Database connected!");
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
})();

// Start Server
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
