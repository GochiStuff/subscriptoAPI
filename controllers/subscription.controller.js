import mongoose from "mongoose";
import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      name,
      price,
      duration,
      category,
      genre,
      paymentMethod,
      startDate, 
      renewalDate,
      status,
      userId,
    } = req.body;

    // Check if a similar subscription already exists
    const existAlready = await Subscription.findOne({
      userId,
      name,
      status,
    }).session(session);

    if (existAlready) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ message: "Subscription already exists" });
    }

    // Create the subscription
    const [newSubscription] = await Subscription.create(
      [
        {
          name,
          price,
          duration,
          category,
          genre,
          paymentMethod,
          startDate,
          renewalDate,
          status,
          userId,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Subscription was created successfully!",
      subscription: {
        id: newSubscription._id,
        name: newSubscription.name,
        userId: newSubscription.userId,
        status: newSubscription.status,
        },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: error.message });
  }
};

export const getAllSubscriptions = async ( req, res ) => { 

    
};