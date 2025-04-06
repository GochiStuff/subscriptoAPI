import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      min: 0,
    },
    duration: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: [true, "Subscription duration is required"],
    },
    category: {
      type: String,
      enum: ["basic", "premium", "enterprise"],
      required: [true, "Subscription category is required"],
    },
    genre: {
      type: String,
      enum: ["tv", "movie", "sports", "news", "documentary"],
      required: [true, "Subscription genre is required"],
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "bank_transfer"],
      required: [true, "Payment method is required"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      validate: {
        validator: (value) => value <= new Date(),
        message: "Start date cannot be in the future",
      },
    },
    renewalDate: {
      type: Date,
      // required: [true, "Renewal date is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto set renewalDate and status before saving
subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate && this.startDate && this.duration) {
    const periodDays = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    const daysToAdd = periodDays[this.duration] || 30;

    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(this.startDate.getDate() + daysToAdd);
  }

  this.status = this.renewalDate < new Date() ? "inactive" : "active";

  next();
});

export default mongoose.model("Subscription", subscriptionSchema);
