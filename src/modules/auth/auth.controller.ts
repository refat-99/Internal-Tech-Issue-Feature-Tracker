import type{ Request, Response } from "express";
import { signUpIntoDB,logInintoDb } from "./auth.service";

export const signupController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await signUpIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await logInintoDb(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};