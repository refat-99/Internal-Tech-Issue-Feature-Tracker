
import type{ Request, Response, NextFunction } from "express";
 import { verifyToken } from "../utility/jwt";

const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // ✅ FIX: Bearer remove করা
    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};



// import type{ Request, Response, NextFunction } from "express";
// import { verifyToken } from "../utility/jwt";

// const authMiddleware = (
//   req: any,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const token = req.headers.authorization;

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized: No token provided",
//       });
//     }

//     const decoded = verifyToken(token);

//     req.user = decoded;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };

export default authMiddleware ;