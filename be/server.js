import express from "express";
import cors from "cors";
import db from "./config/database.js";
import NoteRoutes from "./routes/NoteRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", NoteRoutes);

// Static Files Configuration
const fePath = path.join(__dirname, '../fe'); // Sesuaikan dengan struktur folder
app.use(express.static(fePath));

// Single Root Route
app.get("/", (req, res) => {
  res.sendFile(path.join(fePath, 'index.html'));
});

// Database Connection
(async () => {
  try {
    await db.authenticate();
    console.log("Database connected!");
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
})();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});