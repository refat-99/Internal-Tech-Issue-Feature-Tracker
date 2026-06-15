import express, {} from "express";
import dotenv from "dotenv";
dotenv.config();
import { issueRoute } from "./modules/issues/issue.route";
import { authRoute } from "./modules/auth/auth.route";
const app = express();
// Middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
// Route
app.use('/api/auth', authRoute);
app.use("/api/issues", issueRoute);
export default app;
//# sourceMappingURL=app.js.map