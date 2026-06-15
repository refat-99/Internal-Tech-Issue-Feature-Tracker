import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET;
export const signToken = (payload) => {
    return jwt.sign(payload, SECRET, {
        expiresIn: "7d",
    });
};
console.log("JWT SECRET LOADED:", !!SECRET);
export const verifyToken = (token) => {
    return jwt.verify(token, SECRET);
};
//# sourceMappingURL=jwt.js.map