import express, { Request, Response } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes";
import env from "./config/env";
import connectDB from "./config/db";

const app = express();
connectDB();

// Middlewares
app.use(
  cors({
    origin: env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  import("morgan").then(() => {
    app.use(morgan("tiny"));
  });
}

// Routes
app.use(routes);

// Test route
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

// Catch-all route for invalid requests
app.use(/.*/, (req: Request, res: Response) => {
  res.status(404).json({
    // Changed to 404
    message: `Endpoint not found: ${req.originalUrl}`,
  });
});

// Error handling middleware
app.use((err, _req: Request, res: Response) => {
  console.log(err);
  res.status(500).json({ message: "Oops! Something went wrong." });
});

const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});

export default app;
