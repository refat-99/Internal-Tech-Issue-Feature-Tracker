import jwt from "jsonwebtoken";

const SECRET = "secret_key";

export const signToken = (payload: any) =>
  jwt.sign(
    payload, 
    SECRET, 
    { expiresIn: "7d" });

export const verifyToken = (token: string) =>
  jwt.verify(token, SECRET);