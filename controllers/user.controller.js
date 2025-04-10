import User from "../models/user.model.js";
import FriendRequest from "../models/friendReq.model.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({ success: true, message: "Profile updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

export const sendFriendRequest = async (req, res) => {
  const { to_username } = req.body;
  const user_id = req.user?.id;
  const from_username = req.user?.username;

  try {
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // if (user_username !== from_username) {
    //   return res.status(403).json({ message: "Forbidden: Invalid sender identity" });
    // }

    // Check if the target user exists
    const receiverExists = await User.findOne({ username: to_username });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver user not found" });
    }

    const existingRequest = await FriendRequest.findOne({
      sender: from_username,
      receiver: to_username,
      status: "pending"
    });
    if (existingRequest) {
      return res.status(409).json({ message: "Friend request already sent" });
    }

    await FriendRequest.create({
      sender: from_username,
      receiver: to_username,
      status: "pending",
    });

    res.status(200).json({ success: true, message: "Friend request sent" });

  } catch (error) {
    res.status(500).json({ message: "Error sending friend request", error: error.message });
  }
};

export const getFriendRequests = async (req, res) => {
  const username = req.user?.username;

  try {
    const received = await FriendRequest.find({ receiver: username });
    const sent = await FriendRequest.find({ sender: username });

    res.status(200).json({
      success: true,
      received: received.map(r => ({
        sender: r.sender,
        status: r.status,
        createdAt: r.createdAt
      })),
      sent: sent.map(r => ({
        receiver: r.receiver,
        status: r.status,
        createdAt: r.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching friend requests", error: error.message });
  }
};

export const respondToFriendRequest = async (req, res) => {
  const username = req.user?.username;
  const { sender, action } = req.body;

  if (!["accept", "decline"].includes(action)) {
    return res.status(400).json({ message: "Invalid action. Use 'accept' or 'decline'." });
  }

  try {
    const request = await FriendRequest.findOne({
      sender,
      receiver: username,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    request.status = action === "accept" ? "accepted" : "rejected";
    await request.save();

    let friendUsername = null;

    if (action === "accept") {

      await User.updateOne({ username }, { $addToSet: { friends: sender } });
      await User.updateOne({ username: sender }, { $addToSet: { friends: username } });
      friendUsername = sender;
    }

    res.status(200).json({
      success: true,
      message: `Friend request ${action}ed.`,
      friend: friendUsername,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating friend request", error: error.message });
  }
};

