import { verifyToken } from "../utility/jwt";
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided",
            });
        }
        // Authentication Bearer token format: "Bearer <token>"
        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
export default authMiddleware;
//# sourceMappingURL=auth.middleware.js.map