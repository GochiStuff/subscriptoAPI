// subscription.controller.js
import mongoose from "mongoose";
import Subscription from "../models/subscription.model.js";

export const createUserSubscription = async (req, res) => {
  
  // wanted to user session but not needed so not using it for now .

  const username = req.user?.username;

  try {
     const {
      platform,
      collaborations = [],
      split = {},
      name,
      plan,
      price,
      currency,
      duration,
      category,
      startDate,
      endDate,
      status,
      paymentMethod,
      country,
    } = req.body;

    const existing = await Subscription.findOne({ name: name , admin: username });
    if (existing) {
      return res.status(400).json({ message: "Subscription with this name already exists." });
    }

    const newSubscription = await Subscription.create({
      platform,
      admin: username,
      collaborations,
      split,
      name,
      plan,
      price,
      currency,
      duration,
      category,
      startDate,
      endDate,
      status,
      paymentMethod,
      country,
    });

    res.status(201).json({ success: true, message: "Subscription created", subscription: newSubscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserSubscriptions = async (req, res) => {

  const username = req.user?.username;

  if(!username){
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    const subscriptions = await Subscription.find({
      $or:[
        { admin: username },
        { collaborations: username }
      ]
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true ,  subscriptions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// TODO : 
// check if the all the collaborations are the friends of the user in the backend too. 


export const updateUserSubscription = async (req, res) => {
  const updates = req.body.subscription;
  const requestingUsername = req.user.username;

  if (!requestingUsername) {
    return res.status(401).json({ message: "Unauthorized: No user data" });
  }

  try {
    const subscription = await Subscription.findById(updates._id);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (subscription.admin !== requestingUsername) {
      return res.status(403).json({ message: "Forbidden: Only the admin can update this subscription" });
    }

    const updatedSub = await Subscription.findByIdAndUpdate(
      updates._id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Subscription updated",
      subscription: updatedSub,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUserSubscription = async (req, res) => {
  const subscriptionId = req.params.id;
  const requestingUsername = req.user?.username;

  if (!requestingUsername) {
    return res.status(401).json({ message: "Unauthorized: No user data" });
  }

  if (!subscriptionId) {
    return res.status(400).json({ message: "Subscription ID is required" });
  }

  try {
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if(subscription.admin != requestingUsername){
      return res.status(403).json({message: "Forbidden: Only admin of the subscription can delete it."});
    };

    // NOTE: Make sure you’re comparing values of the same type (ObjectId to string)
    // if (subscription.admin.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({
    //     message: "Forbidden: Only the admin can delete this subscription",
    //   });
    // }

    await Subscription.deleteOne({ _id: subscriptionId });

    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
