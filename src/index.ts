import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";

const app = express();

// Enable CORS for development (Frontend runs on port 5173, Backend on port 5000)
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? process.env.FRONTEND_URL 
    : "http://localhost:5173",
  credentials: true,
}));

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(`[api] ${logLine}`);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Error handling middleware with specific error types
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    
    // Handle specific error types
    if (err.name === "UnauthorizedError") {
      return res.status(401).json({ 
        message: "Invalid or expired token",
        error: "UNAUTHORIZED"
      });
    }
    
    if (err.name === "ValidationError") {
      return res.status(400).json({ 
        message: "Validation failed",
        error: "VALIDATION_ERROR",
        details: err.details
      });
    }

    if (status === 404) {
      return res.status(404).json({ 
        message: "Route not found",
        error: "NOT_FOUND"
      });
    }

    const message = err.message || "Internal Server Error";
    console.error(`[error] ${status}: ${message}`, err);
    
    res.status(status).json({ 
      message,
      error: "INTERNAL_ERROR",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
  });

  // 404 handler for undefined routes
  app.use((_req, res) => {
    res.status(404).json({ 
      message: "Route not found",
      error: "NOT_FOUND"
    });
  });

  // Backend API server on port 5000
  const port = parseInt(process.env.PORT || '5000', 10);
  const listenOptions: import("net").ListenOptions & { reusePort?: boolean } = {
    port,
    host: "0.0.0.0",
  };

  if (process.platform !== "win32") {
    listenOptions.reusePort = true;
  }

  server.listen(listenOptions, () => {
    console.log(`[backend] API server running on port ${port}`);
  });
})();
