import mongoose from "mongoose";

const friendReqSchema = new mongoose.Schema(
  {
    sender: {
      type: String, // just the username string
      required: true,
      trim: true,
    },
    receiver: {
      type: String, // just the username string
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  },
  { timestamps: true }
);

// TTL index to auto-delete expired requests
friendReqSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("FriendRequest", friendReqSchema);
