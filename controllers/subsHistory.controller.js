// subscription.controller.js
import subsHistoryModel from "../models/subsHistory.model.js";

export const createSubsHistory = async (req, res) => {
  
  // wanted to user session but not needed so not using it for now .

  const username = req.user?.username;

  try {
     const {

        name,
        role,
        platform,
        category,
        currency,
        collaborations,
        startDate,
        durationType,
        endDate,
        paymentMethod,
        price,
      
        status,
      
        createdAt,
        updatedAt
    } = req.body;

    const username  = req.user.username;

    // const existing = await subsHistoryModel.findOne({ name: name , platform: platform  , s });
    // if (existing) {
    //   return res.status(400).json({ message: "Subscription with this name already exists." });
    // }

    const newHistory = await subsHistoryModel.create({
        username,
        name,
        role,
        platform,
        category,
        currency,
        collaborations,
        startDate,
        durationType,
        endDate,
        paymentMethod,
        price,
        status,
        createdAt,
        updatedAt
    });

    res.status(201).json({ success: true, message: "History element created", history: newHistory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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




export const updateSubsHistroy = async (req, res) => {
  const updates = req.body.history;
  const requestingUsername = req.user.username;

  if (!requestingUsername) {
    return res.status(401).json({ message: "Unauthorized: No user data" });
  }

  try {
    const newHistory = await subsHistoryModel.findById(updates.id);

    if (!newHistory) {
      return res.status(404).json({ message: "History element not found" });
    }

    // if (newHistory. !== requestingUsername) {
    //   return res.status(403).json({ message: "Forbidden: Only the admin can update this subscription" });
    // }

    const updatedHis = await subsHistoryModel.findByIdAndUpdate(
      updates.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "History element updated",
      history: updatedHis,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSubsHistory = async (req, res) => {
  const historyId = req.params.id;
  const requestingUsername = req.user?.username;

  if (!requestingUsername) {
    return res.status(401).json({ message: "Unauthorized: No user data" });
  }

  if (!historyId) {
    return res.status(400).json({ message: "Subscription ID is required" });
  }

  try {
    const history = await subsHistoryModel.findById(historyId);

    if (!history) {
      return res.status(404).json({ message: "History elemeent not found" });
    }

    // if(history.admin != requestingUsername){
    //   return res.status(403).json({message: "Forbidden: Only admin of the subscription can delete it."});
    // };

    // NOTE: Make sure you’re comparing values of the same type (ObjectId to string)
    // if (subscription.admin.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({
    //     message: "Forbidden: Only the admin can delete this subscription",
    //   });
    // }

    await subsHistoryModel.deleteOne({ _id: historyId });

    res.status(200).json({
      success: true,
      message: "History element deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
