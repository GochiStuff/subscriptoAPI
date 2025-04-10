import { Router } from "express";
import {
  updateProfile,
  sendFriendRequest,
  getFriendRequests,
  respondToFriendRequest,
  // deleteProfile,
} from "../controllers/user.controller.js";
import authorize from "../middleware/auth.middleware.js";
import { getUsers } from "../controllers/user.admin.controller.js";

const userRouter = Router();

//ADMIN ONLY ( NOT MADE FOR NOW ) 
userRouter.get("/", getUsers);


// USER ACCESSABLE ROUTES
// creation is controllerd by auth 
userRouter.put("/profile", authorize, updateProfile);
userRouter.post("/friends/SendRequest" , authorize , sendFriendRequest);
userRouter.get("/friends/GetAllRequests" , authorize , getFriendRequests);
userRouter.post("/friends/response" , authorize , respondToFriendRequest);
// userRouter.delete("/profile" , authorize , deleteProfile); ( TODO )

export default userRouter;
