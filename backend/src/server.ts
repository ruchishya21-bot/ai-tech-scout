import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import researchRoutes from "./routes/researchRoutes";
import { pool } from "./config/database";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT || 5000);

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Tech Scout API is running 🚀",
  });
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      success: true,
      status: "healthy",
      database: "connected",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check database error:", error);

    res.status(503).json({
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
      message: "Database connected 🚀",
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

app.use("/api/research", researchRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled server error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);

const server = app.listen(PORT, () => {
  console.log("======================================");
  console.log("       AI TECH SCOUT API");
  console.log("======================================");
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Port: ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log("======================================");
});

const shutdown = async (signal: string) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    try {
      await pool.end();
      console.log("Database connection closed.");
      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));