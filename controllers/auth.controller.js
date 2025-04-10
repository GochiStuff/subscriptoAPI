import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js"; // Make sure this model exists
import subscriptionModel from "../models/subscription.model.js";

export const signUp = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, username ,  email, password } = req.body;

        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [newUser] = await User.create(
            [{ name,username ,  email, password: hashedPassword }],
            { session }
        );

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        await session.commitTransaction();
        session.endSession();

        // Setting up HTTP-only cookie for the token  ( so now we are saving cookies on the server side )
        res.cookie("token" , token , {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days

        });


        res.status(201).json({
            message: "User created successfully",
            // token,
            user: {
                name: newUser.name,
                username: newUser.username,
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

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,             // Set to true ONLY in production with HTTPS
            sameSite: "Lax",           // Or 'None' if cross-site
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
          
        
        // This is the only place where I am sending user his/her data so no need to define any other function for now can use this only . 
        // putting together all user data and sending it ( user + all the subscription he is a part of ) 
        // getting all user subscriptions .

        const filteredUsersubscriptions = await subscriptionModel.find({
            $or: [
                { admin : user._id },
                { collaborations : user._id }
            ]
        });
        const userData = user.toObject();
        const { _id, password : String, updatedAt, ...filteredUser } = userData;

        // assing subs of the user . 
        filteredUser.subscriptions = filteredUsersubscriptions;
        
        res.status(200).json({
          message: "Sign in successful",
          user: filteredUser,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const signOut = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        sameSite: "lax",
    });
    res.status(200).json({ message: "Sign out successful" });
};

