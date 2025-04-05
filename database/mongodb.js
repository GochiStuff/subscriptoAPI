import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
    throw new Error("Please define the MongoDB URI");
}

const connectToDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`✅ Connected to MongoDB (${NODE_ENV})`);
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectToDB;
