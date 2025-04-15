import { Router } from "express";
import {

  updateProfile,
  sendFriendRequest,
  getFriendRequests,
  respondToFriendRequest,
  getAllFriends,
  removeFriend,

} from "../controllers/user.controller.js";
import authorize from "../middleware/auth.middleware.js";
import { getUsers } from "../controllers/user.admin.controller.js";
import { auth } from "google-auth-library";

const userRouter = Router();

//ADMIN ONLY ( NOT MADE FOR NOW ) 
userRouter.get("/", getUsers);


// USER ACCESSABLE ROUTES
// creation is controllerd by auth 
userRouter.put("/profile", authorize, updateProfile);
userRouter.post("/friend-request/send", authorize, sendFriendRequest);
userRouter.get("/friend-requests", authorize, getFriendRequests);
userRouter.post("/friend-request/respond", authorize, respondToFriendRequest);
userRouter.get("/friends", authorize, getAllFriends);
userRouter.post("/friends-confirm/remove", authorize, removeFriend);

// userRouter.delete("/profile" , authorize , deleteProfile); ( TODO )

export default userRouter;
