// subscription.controller.js
import mongoose from "mongoose";
import Subscription from "../models/subscription.model.js";


export const createUserSubscription = async (req, res) => {
  const username = req.user?.username;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const sub = req.body.subscription;

    console.log(sub);

    if (!sub?.name || !sub?.platform || !sub?.currentPlan) {
      return res.status(400).json({ message: "Incomplete subscription data" });
    }

    const existing = await Subscription.findOne({ name: sub.name, admin: username });
    if (existing) {
      return res.status(400).json({
        message: "Subscription with this name already exists.",
      });
    }

    const newSubscription = await Subscription.create({
      ...sub,
      admin: username, // override just in case
    });

    return res.status(201).json({
      success: true,
      message: "Subscription created",
      subscription: newSubscription,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// not using for now . 
// export const getUserSubscriptions = async (req, res) => {

//   const username = req.user?.username;

//   if(!username){
//     return res.status(401).json({ message: "Unauthorized" });
//   }
  
//   try {
//     const subscriptions = await Subscription.find({
//       $or:[
//         { admin: username },
//         { collaborations: username }
//       ]
//     }).sort({ createdAt: -1 });
//     res.status(200).json({ success: true ,  subscriptions });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// TODO : 
// check if the all the collaborations are the friends of the user in the backend too. 
export const updateUserSubscription = async (req, res) => {
  const updates = req.body.subscription;
  const requestingUsername = req.user?.username;

  if (!requestingUsername) {
    return res.status(401).json({ message: "Unauthorized: No user data" });
  }

  try {
    const subscription = await Subscription.findById(updates._id);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (subscription.admin !== requestingUsername) {
      return res.status(403).json({
        message: "Forbidden: Only the admin can update this subscription",
      });
    }

    // Update current plan (replace entirely)
    if (updates.currentPlan) {
      subscription.currentPlan = {
        plan: updates.currentPlan.plan,
        price: updates.currentPlan.price,
        collaborations: updates.currentPlan.collaborations,
        split: updates.currentPlan.split || {},
      };
    }

    // Update basic fields
    subscription.name = updates.name || subscription.name;
    subscription.platform = updates.platform || subscription.platform;
    subscription.category = updates.category || subscription.category;
    subscription.currency = updates.currency || subscription.currency;
    subscription.paymentMethod = updates.paymentMethod || subscription.paymentMethod;
    subscription.status = updates.status || subscription.status;

    // Optionally update periods if provided
    if (Array.isArray(updates.periods) && updates.periods.length > 0) {
      subscription.periods = updates.periods;
    }

    subscription.updatedAt = new Date();

    const updatedSub = await subscription.save();

    return res.status(200).json({
      success: true,
      message: "Subscription updated",
      subscription: updatedSub,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
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

    if (subscription.admin !== requestingUsername) {
      return res.status(403).json({
        message: "Forbidden: Only admin of the subscription can delete it.",
      });
    }

    await Subscription.deleteOne({ _id: subscriptionId });

    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
