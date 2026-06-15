import express, { type Application } from "express";
import dotenv from "dotenv";
import { authRoute } from "./modules/auth/auth.route";
import { issueRoute } from "./modules/issues/issue.route";

dotenv.config();

// import {issueRoute } from "./modules/issues/issue.route.js";
// import {authRoute} from "./modules/auth/auth.route.js";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Internal Issue Tracker API is running",
  });
});
app.use((req, res, next) => {
  console.log("HIT:", req.method, req.url);
  next();
});

app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoute);

export default app;