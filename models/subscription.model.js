import mongoose from "mongoose";

const periodSchema = new mongoose.Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: { type: Number, required: true },
    collaborations: { type: [String], default: [] },
    planName: { type: String, required: true },
    split: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { _id: false }
);


const currentPlanSchema = new mongoose.Schema(
  {
    plan: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    collaborations: {
      type: [String],
      default: [],
    },
    split: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { _id: false }
);

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    admin: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "paused", "cancelled"],
      required: true,
    },
    currentPlan: {
      type: currentPlanSchema,
      required: true,
    },
    periods: {
      type: [periodSchema],
      default: [],
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
    updatedAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
