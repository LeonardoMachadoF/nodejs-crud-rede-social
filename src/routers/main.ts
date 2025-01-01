import { Router } from "express";
import * as authController from "../controllers/authController"
import * as tweetController from "../controllers/tweetController"
import * as userController from "../controllers/userController"
import { verifyJTW } from "../utils/jtw";

export const mainRouter = Router();

mainRouter.get("/ping", verifyJTW, (req, res) => {
    res.json({ pong: true });
})

mainRouter.post("/auth/signup", authController.signup);
mainRouter.post("/auth/signin", authController.signin);

mainRouter.post("/tweet", verifyJTW, tweetController.addTweet);
mainRouter.get("/tweet/:id", verifyJTW, tweetController.getTweet);
mainRouter.get("/tweet/:id/answers", verifyJTW, tweetController.getAnswers);
mainRouter.post("/tweet/:id/like", verifyJTW, tweetController.likeToggle);

mainRouter.get("/user/:slug", verifyJTW, userController.getUser);
mainRouter.get("/user/:slug/tweets", verifyJTW, userController.getUserTweets);
mainRouter.post("/user/:slug/follow", verifyJTW, userController.followToggle);
mainRouter.put("/user", verifyJTW, userController.updateUser);
// mainRouter.put("/user/avatar");
// mainRouter.put("/user/cover");

// mainRouter.get("/feed");
// mainRouter.get("/search");
// mainRouter.get("/trending");
// mainRouter.get("/suggestions");