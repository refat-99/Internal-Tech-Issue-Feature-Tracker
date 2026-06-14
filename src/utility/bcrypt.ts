import bcrypt from "bcrypt";
import type { IUser } from "../types/type";

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
 }

export const comparePassword = async (password: string, user: IUser) => {
  const isMatched = await bcrypt.compare(password, user.password);
  return isMatched;

}
  // await bcrypt.compare(password, hash);