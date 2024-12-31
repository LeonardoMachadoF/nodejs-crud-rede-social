import { Router } from "express";
import * as authController from "../controllers/authController"
import * as tweetControllet from "../controllers/tweetController"
import { verifyJTW } from "../utils/jtw";

export const mainRouter = Router();

mainRouter.get("/ping", verifyJTW, (req, res) => {
    res.json({ pong: true });
})

mainRouter.post("/auth/signup", authController.signup);
mainRouter.post("/auth/signin", authController.signin);

mainRouter.post("/tweet", verifyJTW, tweetControllet.addTweet);
// mainRouter.get("/tweet/:id");
// mainRouter.get("/tweet/:id/answers");
// mainRouter.post("/tweet/:id/like");

// mainRouter.get("/user/:slug");
// mainRouter.get("/user/:slug/tweets");
// mainRouter.post("/user/:slug/follow");
// mainRouter.put("/user");
// mainRouter.put("/user/avatar");
// mainRouter.put("/user/cover");

// mainRouter.get("/feed");
// mainRouter.get("/search");
// mainRouter.get("/trending");
// mainRouter.get("/suggestions");