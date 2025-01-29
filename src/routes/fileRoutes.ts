import { Router } from "express";
import * as avatarController from "../controllers/avatarController";
import * as coverController from "../controllers/coverController";
import { verifyJWT } from "../utils/jtw";
import { upload } from "../utils/multer";

export const fileRouter = Router();

fileRouter.put("/avatar", verifyJWT(), upload.single('avatar'), avatarController.uploadAvatar);
fileRouter.put("/cover", verifyJWT(), upload.single('cover'), coverController.uploadCover);
