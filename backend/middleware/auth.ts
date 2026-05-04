import { Request, Response, NextFunction } from "express";

const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1] || req.headers.token;

    if (!token || Array.isArray(token)) {
        return res.status(401).json({
            success: false,
            message: "Please login first",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid user",
            });
        }

        (req as any).user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

module.exports = authMiddleware;