import type{ Request, Response } from "express";
import { signUpIntoDB,logInintoDb } from "./auth.service";
import sendResponse from "../../utility/sendResponse";

export const signupController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await signUpIntoDB(req.body);

  sendResponse(res,{
  statusCode: 201,
  success: true,
  message: "User registered successfully",
    })
  } catch (error: any) {
    sendResponse(res, {
    statusCode: 400,
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

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message,
    });
  }
};