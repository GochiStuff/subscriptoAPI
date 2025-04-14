import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import {
  // getUserSubscriptions,
  updateUserSubscription,
  createUserSubscription,
  deleteUserSubscription
} from "../controllers/subscription.controller.js";


const subscriptionRouter = Router();

// ADMIN ONLY ( NOT MADE FOR NOW )
// subscriptionRouter.get("/", getAllSubscriptions);


// USER ACCESSABLE ROUTES
// subscriptionRouter.get("/", authorize, getUserSubscriptions); // Get current user's subs
subscriptionRouter.post("/", authorize, createUserSubscription); // Add sub (preset/custom)
subscriptionRouter.put("/", authorize, updateUserSubscription); // PUt sub (preset/custom)
subscriptionRouter.delete("/:id" , authorize , deleteUserSubscription); // Delete sub ( preset/custom)



export default subscriptionRouter;
