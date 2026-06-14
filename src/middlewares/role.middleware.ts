import type{ Request, Response, NextFunction } from "express";

export const roleMiddleware =
  (role: string) =>
  (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };