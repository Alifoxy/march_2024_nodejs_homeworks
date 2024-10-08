import { Router } from "express";

import { userController } from "../controllers/user.controller";
import {commonMiddleware} from "../middlewares/common.middleware";
import {UserValidator} from "../validators/user.validator";
import {authMiddleware} from "../middlewares/auth.middleware";
import {fileMiddleware} from "../middlewares/file.middleware";
import {avatarConfig} from "../constants/image.constants";

const router = Router();

router.get("/", userController.getList);
router.get("/me", authMiddleware.checkAccessToken, userController.getMe);


router.put(
    "/me",
    authMiddleware.checkAccessToken,
    commonMiddleware.isBodyValid(UserValidator.update),
    userController.updateMe
);

router.delete("/me", authMiddleware.checkAccessToken, userController.deleteMe);

router.post(
    "/me/avatar",
    authMiddleware.checkAccessToken,
    fileMiddleware.isFileValid("avatar", avatarConfig),
    userController.uploadAvatar,
);

router.get(
    "/:userId",
    commonMiddleware.isIdValid("userId"),
    userController.getById,

);


export const userRouter = router;