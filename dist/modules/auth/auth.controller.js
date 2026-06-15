import { signUpIntoDB, logInintoDb } from "./auth.service";
import sendResponse from "../../utility/sendResponse";
export const signupController = async (req, res) => {
    try {
        const result = await signUpIntoDB(req.body);
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "User registered successfully",
        });
    }
    catch (error) {
        sendResponse(res, {
            statusCode: 400,
            success: false,
            message: error.message,
        });
    }
};
export const loginController = async (req, res) => {
    try {
        const result = await logInintoDb(req.body);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Login successful",
            data: result,
        });
    }
    catch (error) {
        sendResponse(res, {
            statusCode: 400,
            success: false,
            message: error.message,
        });
    }
};
//# sourceMappingURL=auth.controller.js.map