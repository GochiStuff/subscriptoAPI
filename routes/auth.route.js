import { Router } from "express";
import passport from "passport";
import { signIn, signOut, signUp , checkAuth, serverup } from "../controllers/auth.controller.js";
import { auth } from "google-auth-library";
import authorize from "../middleware/auth.middleware.js";

const authRouter = Router();

// Local auth
authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);
authRouter.post('/sign-out', signOut);

authRouter.get('/check-auth' , authorize ,  checkAuth);
authRouter.get('/check-auth/serverup' , authorize ,  serverup);


export default authRouter;
