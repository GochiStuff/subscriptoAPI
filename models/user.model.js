import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      trim: true,
      minlength: 3,
      maxlength: 15,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) =>
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
        message: "Please enter a valid email",
      },
    },
    friends: {
      type: [String], // or [mongoose.Schema.Types.ObjectId] if you prefer
      default: [],
    },    
    password: {
      type: String,
      minLength: 6,
    },
    googleId: {
      type: String,
    },
    avatar: {
      type: String,
      default: "/images/user.png",
    },

    // Preferences
    currency: {
      type: String,
      default: "USD",
    },
    country: {
      type: String,
      default: "India",
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    language: {
      type: String,
      default: "en",
    },
    notifyBeforeDays: {
      type: Number,
      default: 3,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
