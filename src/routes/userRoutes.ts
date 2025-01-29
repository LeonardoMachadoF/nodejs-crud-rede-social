import { Router } from "express";
import * as userController from "../controllers/userController";
import { verifyJWT } from "../utils/jtw";

export const userRouter = Router();

userRouter.get("/me", verifyJWT(), userController.getUserByToken);
userRouter.get("/:slug", verifyJWT(), userController.getUser);
userRouter.get("/:slug/tweets", verifyJWT(), userController.getUserTweets);
userRouter.post("/:slug/follow", verifyJWT(), userController.followToggle);
userRouter.put("/", verifyJWT(), userController.updateUser);
