import { pool } from "../../db/db";
import jwt from "jsonwebtoken";
import { signToken } from "../../utility/jwt";
// import {comparePassword, hashPassword}  from "../../utility/bcrypt";
import type { IUser } from "../../types/type";
import bcrypt from "bcryptjs";
import config from "../../config";


export const signUpIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (existingUser.rowCount) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
  //  const hashedPassword = await hashPassword(password);
  
  const result = await pool.query(
    `
      INSERT INTO users
      (name,email,password,role)
      VALUES ($1,$2,$3,$4)
      RETURNING *
    `,
    [
      name,
      email,
      hashedPassword,
      role || "contributor",
    ]
  );
  delete result.rows[0].password;

  return result.rows[0];
};

export const logInintoDb = async (payload: IUser) => {
  const { email, password } = payload;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid credentials");
  }

  const user = result.rows[0];
  console.log("USER FROM DB:", user);

  // const isMatched = await comparePassword(password, user.password);
  const isMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatched) {
    throw new Error("Invalid credentials");
  }

  // const token = (payload: any) =>
  //   jwt.sign(
  //     payload, 
  //     SECRET, 
  //     { expiresIn: "7d" });

  // const token = signToken({
  //   id: user.id,
  //   email: user.email,
  //   role: user.role,
  // });
  const  jwtToken = {
    id: user.id,
    email: user.email,
    role: user.role,
  }

  const accesstoken = jwt.sign(jwtToken,
     config.secret, {
     expiresIn: "7d" ,
    });
// console.log("Generated JWT:", accesstoken);
  return {
    accesstoken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  };
};
const authService = {
  signUpIntoDB,
  logInintoDb,
};

export default authService;