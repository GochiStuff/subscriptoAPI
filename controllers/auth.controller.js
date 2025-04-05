import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js"; // Make sure this model exists

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [newUser] = await User.create(
            [{ name, email, password: hashedPassword }],
            { session }
        );

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: error.message });
    }
};

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        res.status(200).json({
            message: "Sign in successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const signOut = async (req, res, next) => {
    try {
        // You can clear token on frontend or invalidate session token here if you're using cookies
        res.status(200).json({ message: "Sign out successful" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
