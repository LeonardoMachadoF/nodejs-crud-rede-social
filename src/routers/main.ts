import { request, response, Router } from "express";
import * as authController from "../controllers/authController"
import * as tweetController from "../controllers/tweetController"
import * as userController from "../controllers/userController"
import * as feedController from "../controllers/feedController"
import * as searchController from "../controllers/searchController"
import * as avatarController from "../controllers/avatarController"
import * as coverController from "../controllers/coverController";
import { verifyJWT } from "../utils/jtw";
import { upload } from "../utils/multer";

export const mainRouter = Router();

mainRouter.get("/ping", verifyJWT(), (req, res) => {
    res.json({ pong: true });
})

mainRouter.post("/auth/signup", authController.signup);
mainRouter.post("/auth/signin", authController.signin);

mainRouter.post("/tweet", verifyJWT(), tweetController.addTweet);
mainRouter.get("/tweet/:id", verifyJWT(), tweetController.getTweet);
mainRouter.get("/tweet/:id/answers", verifyJWT(), tweetController.getAnswers);
mainRouter.post("/tweet/:id/like", verifyJWT(), tweetController.likeToggle);

mainRouter.get("/user/me", verifyJWT(), userController.getUserByToken);
mainRouter.get("/user/:slug", verifyJWT(), userController.getUser);
mainRouter.get("/user/:slug/tweets", verifyJWT(), userController.getUserTweets);
mainRouter.post("/user/:slug/follow", verifyJWT(), userController.followToggle);
mainRouter.put("/user", verifyJWT(), userController.updateUser);

mainRouter.put("/user/avatar", verifyJWT(), upload.single('avatar'), avatarController.uploadAvatar);
mainRouter.put("/user/cover", verifyJWT(), upload.single('cover'), coverController.uploadCover);

mainRouter.get("/feed", verifyJWT(), feedController.getFeed);
mainRouter.get("/search", verifyJWT(), searchController.searchTweets);
mainRouter.get("/trending", verifyJWT(), searchController.getTrends);
mainRouter.get("/suggestions", verifyJWT(), searchController.getSuggestions);