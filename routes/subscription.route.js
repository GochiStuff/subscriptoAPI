import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import {
  getUserSubscriptions,
  updateUserSubscription,
  createUserSubscription,
  deleteUserSubscription
} from "../controllers/subscription.controller.js";

import { createSubsHistory , updateSubsHistroy , deleteSubsHistory } from "../controllers/subsHistory.controller.js";

const subscriptionRouter = Router();

// ADMIN ONLY ( NOT MADE FOR NOW )
// subscriptionRouter.get("/", getAllSubscriptions);


// USER ACCESSABLE ROUTES
subscriptionRouter.get("/", authorize, getUserSubscriptions); // Get current user's subs
subscriptionRouter.post("/", authorize, createUserSubscription); // Add sub (preset/custom)
subscriptionRouter.put("/", authorize, updateUserSubscription); // PUt sub (preset/custom)
subscriptionRouter.delete("/:id" , authorize , deleteUserSubscription); // Delete sub ( preset/custom)

      // subscription history !! 
subscriptionRouter.post("/history" , authorize , createSubsHistory);
subscriptionRouter.put("/history" , authorize , updateSubsHistroy);
subscriptionRouter.delete("/history/:id" , authorize , deleteSubsHistory);



export default subscriptionRouter;
