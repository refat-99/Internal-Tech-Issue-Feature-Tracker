import { pool } from "../../db/db";
import { signToken } from "../../utility/jwt";
// import {comparePassword, hashPassword}  from "../../utility/bcrypt";
import type { IUser } from "../../types/type";
import { hashPassword, matched } from "../../utility/bcrypt";


export const signUpIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (existingUser.rowCount) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await hashPassword(password);
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
  const dbPassword = user.password;

//call and compare the password
  const isMatched = matched(password, dbPassword);

  if (!isMatched) {
    throw new Error("Invalid credentials");
  }
  const  jwtToken = {
    id: user.id,
    email: user.email,
    role: user.role,
  }

  const accesstoken = signToken(jwtToken);
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