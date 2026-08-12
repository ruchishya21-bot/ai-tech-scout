import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import researchRoutes from "./routes/researchRoutes";
import { pool } from "./config/database";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/research", researchRoutes);

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      success: true,
      status: "healthy",
      database: "connected",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check error:", error);

    res.status(500).json({
      success: false,
      status: "unhealthy",
      database: "disconnected",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    });
  }
});

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "Database connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

export default app;

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}