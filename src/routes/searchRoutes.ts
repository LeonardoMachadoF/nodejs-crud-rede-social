import { Router } from "express";
import * as searchController from "../controllers/searchController";
import { verifyJWT } from "../utils/jtw";

export const searchRouter = Router();

searchRouter.get("/", verifyJWT(), searchController.searchTweets);
searchRouter.get("/trending", verifyJWT(), searchController.getTrends);
searchRouter.get("/suggestions", verifyJWT(), searchController.getSuggestions);
