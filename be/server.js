import express from "express";
import cors from "cors";
import db from "./config/database.js";
import NoteRoutes from "./routes/NoteRoutes.js";

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", NoteRoutes);

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
