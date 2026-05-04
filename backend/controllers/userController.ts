import { Request, Response } from "express";

const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const createToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

//* Login User
const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        const isMatched = await bcrypt.compare(password, user.password);

        if (!isMatched) {
            return res.json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = createToken(user._id);

        return res.json({
            success: true,
            token,
        });
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: "Error occurred while logging in",
        });
    }
};

//* Register User
const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await userModel.findOne({ email });

        if (userExists) {
            return res.json({
                success: false,
                message: "User already exists",
            });
        }

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Invalid email format",
            });
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Password must be at least 8 characters long",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        return res.json({
            success: true,
            token,
        });
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: "Error occurred while registering user",
        });
    }
};

module.exports = { loginUser, registerUser };