import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10)
 }

export const matched = async (password: string, dbPassword: string) => {
  console.log("INPUT PASSWORD:", password);
console.log("DB PASSWORD:", dbPassword);
  return await bcrypt.compare(password, dbPassword);
};
