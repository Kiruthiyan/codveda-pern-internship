require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────
const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/auth");

app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);

// ─── Root health-check ────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Codveda Task Manager API is running 🚀", version: "1.0.0" });
});

// ─── 404 handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Global error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ─── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});