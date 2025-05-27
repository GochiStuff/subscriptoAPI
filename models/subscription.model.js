import mongoose from "mongoose";

const billingHistorySchema = new mongoose.Schema(
  {
    subscriptionId: { type: String, required: true },
    amount: { type: Number, required: true },
    billingDate: { type: Date, required: true },
  },
  { _id: false }
);

const collaborationParticipantSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    priceSplit: {
      type: {
        type: String,
        enum: ["absolute", "percentage"],
        required: true,
      },
      value: { type: Number, required: true },
    },
  },
  { _id: false }
);

const collaborationSchema = new mongoose.Schema(
  {
    admin: {
      username: { type: String, required: true },
    },
    participants: {
      type: [collaborationParticipantSchema],
      default: [],
    },
  },
  { _id: false }
);

const currentPlanSchema = new mongoose.Schema(
  {
    plan: { type: String, required: true },
    price: { type: Number, required: true },
    billingCycle: {
      type: String,
      enum: ["monthly", "annual", "weekly", "quarterly", "custom"],
      required: true,
    },
    startDate: { type: Date, required: true },
    nextBillingDate: { type: Date },
    autoRenew: { type: Boolean, required: true },
  },
  { _id: false }
);

const subscriptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    admin: { type: String, required: true },
    platform: { type: String, required: true },
    logo: { type: String },
    category: { type: String, required: true },
    currency: { type: String, required: true },
    paymentMethod: { type: String },

    status: {
      type: String,
      enum: ["active", "paused", "cancelled", "expired", "trial"],
      required: true,
    },

    currentPlan: { type: currentPlanSchema, required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date },
    freeTrialDuration: { type: Number },

    collaboration: { type: collaborationSchema },

    billingHistories: {
      type: [billingHistorySchema],
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
