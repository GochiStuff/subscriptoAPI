import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js"; 
import Subscription from "../models/subscription.model.js";

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
            secure: process.env.NODE_ENV === "production", // must be true in prod
            sameSite: "None", // required for cross-site cookies
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          });
          
        // This is the only place where I am sending user his/her data so no need to define any other function for now can use this only . 
        // putting together all user data and sending it ( user + all the subscription he is a part of ) 
        // getting all user subscriptions . 


        // SIMPLE COPY PASTE OF THE GET FUNCTION 
        // const filteredUsersubscriptions = await Subscription.find({
        //     $or: [
        //       { admin: user.username },
        //       { collaborations: user.username },
        //     ],
        //   }).sort({ createdAt: -1 }).lean(); // use .lean() to make filtering faster
        // const userSubscriptions = filteredUsersubscriptions.map(sub => {
        //     const relevantPeriods = sub.periods.filter(period =>
        //       period.collaborations.includes(user.username)
        //     );
          
        //     // If the user is admin, show full data. Otherwise only periods where they're involved
        //     if (sub.admin === user.username) {
        //       return sub; // full access
        //     } else {
        //       return {
        //         ...sub,
        //         periods: relevantPeriods,
        //       };
        //     }   
        // });

        const userData = user.toObject();
        const { _id, password: _p, updatedAt, ...filteredUser } = userData;

        // filteredUser.subscriptions = userSubscriptions;

          
        
        res.status(200).json({
          message: "Sign in successful",
          user: filteredUser,
        //   subscriptions: userSubscriptions,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const signOut = (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // match with cookie setup
      sameSite: "Lax", // match with cookie setup
    });
    res.status(200).json({ message: "Sign out successful" });
  };
  

export const checkAuth = (req, res) => {
  res.status(200).json({
    message: "checking",
    user : req.user?.username || null,
  });
};
