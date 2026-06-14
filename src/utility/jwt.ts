import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;

export const signToken = (payload: object) => {
  return jwt.sign(payload, SECRET, {
    expiresIn: "7d",
  });
};
console.log("JWT SECRET LOADED:", !!SECRET);
export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};