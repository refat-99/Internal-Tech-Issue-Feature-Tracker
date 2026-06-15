import express, {
  type Request,
  type Response,
  type Application,
} from "express";
import dotenv from "dotenv";
dotenv.config();
import { issueRoute } from "./modules/issues/issue.route";
import {authRoute}  from "./modules/auth/auth.route";


const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));


// Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: " Internal Issue Tracker API is running",
  });
});


app.use('/api/auth', authRoute);
app.use("/api/issues", issueRoute);


export default app;