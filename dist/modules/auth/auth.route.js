import express from "express";
import { signupController, loginController, } from "./auth.controller";
const router = express.Router();
router.post("/signup", signupController);
router.post("/login", loginController);
export const authRoute = router;
//# sourceMappingURL=auth.route.js.map