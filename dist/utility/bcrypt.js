import bcrypt from "bcrypt";
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};
export const matched = async (password, dbPassword) => {
    console.log("INPUT PASSWORD:", password);
    console.log("DB PASSWORD:", dbPassword);
    return await bcrypt.compare(password, dbPassword);
};
//# sourceMappingURL=bcrypt.js.map