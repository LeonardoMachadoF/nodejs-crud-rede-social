import { Router } from "express";
import { authRouter } from "./authRoutes";
import { tweetRouter } from "./tweetRoutes";
import { userRouter } from "./userRoutes";
import { fileRouter } from "./fileRoutes";
import { feedRouter } from "./feedRoutes";
import { searchRouter } from "./searchRoutes";
import { verifyJWT } from "../utils/jtw";


export const mainRouter = Router();

mainRouter.get("/ping", verifyJWT(), (req, res) => {
    res.json({ pong: true });
});

mainRouter.use("/auth", authRouter);
mainRouter.use("/tweet", tweetRouter);
mainRouter.use("/user", userRouter);
mainRouter.use("/file", fileRouter);
mainRouter.use("/feed", feedRouter);
mainRouter.use("/search", searchRouter);
