import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check - allows monitoring and deployment verification
  app.get("/api/health", (_req, res) => {
    res.json({ 
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // Example users route - demonstrates connectivity
  app.get("/api/users", (_req, res) => {
    res.json([{ 
      id: "1",
      username: "demo_user",
      name: "Demo User",
      createdAt: new Date().toISOString()
    }]);
  });

  // Get current user (requires auth in production)
  app.get("/api/me", (req, res) => {
    // In development, return demo user
    if (process.env.NODE_ENV !== "production") {
      return res.json({ 
        id: "1",
        username: "demo_user",
        email: "demo@example.com"
      });
    }

    // In production, check authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        message: "Unauthorized",
        error: "Missing or invalid authorization header"
      });
    }

    // TODO: Validate JWT/Clerk token here
    res.json({ 
      id: "1",
      username: "authenticated_user",
      email: "user@example.com"
    });
  });

  // API info endpoint
  app.get("/api/info", (_req, res) => {
    res.json({
      name: "LumixCode API",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      endpoints: [
        "/api/health - Health check",
        "/api/info - This endpoint",
        "/api/users - List users",
        "/api/me - Current user (requires auth)"
      ]
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
