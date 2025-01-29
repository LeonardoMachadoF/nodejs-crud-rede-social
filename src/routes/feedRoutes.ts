import { Router } from "express";
import * as feedController from "../controllers/feedController";
import { verifyJWT } from "../utils/jtw";

export const feedRouter = Router();

feedRouter.get("/", verifyJWT(), feedController.getFeed);
