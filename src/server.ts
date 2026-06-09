import express, {
  type Request,
  type Response,
  type Application,
} from "express";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

import config from "./config/db";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const pool = new Pool({
  connectionString: config.connection_string,
});

// Port
const port = config.port || 5000;

// Route
app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Issue Tracker Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// Server Start
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});