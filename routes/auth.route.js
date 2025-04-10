import { Router } from "express";
import passport from "passport";
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";

const authRouter = Router();

// Local auth
authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);
authRouter.post('/sign-out', signOut);



export default authRouter;
