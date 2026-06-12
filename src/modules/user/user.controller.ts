import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";


const createUser = async (req: Request, res: Response) => {

    //  const { name, email, password, role } = req.body;

  try {
   const result = await userService.createUserIntoDB(req.body);
    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Database error",
      error,
    });
  }
}

export const userController = {
    createUser,
}