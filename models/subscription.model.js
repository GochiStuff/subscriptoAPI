import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
    },
    admin: {
      type: String, // Assuming this is a user ID or username; update to ObjectId if needed
      required: true,
    },
    collaborations: {
      type: [String], // Array of usernames or IDs
      default: [],
    },
    split: {
      type: Map,
      of: Number, // Record<string, number>
      default: {},
    },
    name: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true, // e.g., "monthly", "yearly"
    },
    category: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true, 
    },
    paymentMethod: {
      type: String,
      required: true, 
    },
    country: {
      type: String, 
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
