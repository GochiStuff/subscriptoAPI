import User from "../models/user.model.js";
import FriendRequest from "../models/friendReq.model.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = { ...req.body };

    const blockedFields = ["_id", "id", "username", "email", "password", "friends"];
    blockedFields.forEach((field) => delete updates[field]);

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({ success: true, message: "Profile updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};


export const sendFriendRequest = async (req, res) => {
  const { to_username } = req.body;
  const from_username = req.user?.username;

  try {
    if (to_username === from_username) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself" });
    }

    const receiver = await User.findOne({ username: to_username });
    if (!receiver) {
      return res.status(404).json({ message: "Receiver user not found" });
    }

    if (receiver.friends.includes(from_username)) {
      return res.status(409).json({ message: "You are already friends" });
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
    const received = await FriendRequest.find({ receiver: username, status: "pending" });
    const sent = await FriendRequest.find({ sender: username, status: "pending" });

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
  } 
  catch (error) {
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

export const getAllFriends = async (req, res) => {
  const username = req.user?.username;

  try {
    const user = await User.findOne({ username }).select("friends -_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, friends: user.friends });
  } catch (error) {
    res.status(500).json({ message: "Error fetching friends", error: error.message });
  }
};

// REMOVE FRIEND
export const removeFriend = async (req, res) => {
  try {
    const userId = req.user._id; // assuming you're using auth middleware
    const { friend } = req.body; // friend can be username or id depending on how you store it

    if (!friend) return res.status(400).json({ message: "Friend username is required" });

    // Get both users
    const user = await User.findById(userId);
    const friendUser = await User.findOne({ username: friend });

    if (!user || !friendUser) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    // Remove each other from friends list
    user.friends = user.friends.filter(f => f !== friendUser.username);
    friendUser.friends = friendUser.friends.filter(f => f !== user.username);

    await user.save();
    await friendUser.save();

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (err) {
    console.error("Error removing friend:", err);
    res.status(500).json({ message: "Failed to remove friend" });
  }
};

