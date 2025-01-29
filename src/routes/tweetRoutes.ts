import { Router } from "express";
import * as tweetController from "../controllers/tweetController";
import { verifyJWT } from "../utils/jtw";

export const tweetRouter = Router();

tweetRouter.post("/", verifyJWT(), tweetController.addTweet);
tweetRouter.get("/:id", verifyJWT(), tweetController.getTweet);
tweetRouter.get("/:id/answers", verifyJWT(), tweetController.getAnswers);
tweetRouter.post("/:id/like", verifyJWT(), tweetController.likeToggle);
