import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";
import {authMiddleware} from "../middlewares/auth.middleware";

const router = Router();

router.post(
    "/sign-up",
    commonMiddleware.isBodyValid(UserValidator.create),
    authController.signUp,
);

router.post(
    "/sign-in",
    // commonMiddleware.isBodyValid(UserValidator.signIn),
    authController.signIn,
);

router.post(
    "/refresh",
    authMiddleware.checkRefreshToken,
    authController.refresh,
);

router.post("/logout", authMiddleware.checkAccessToken, authController.logout);

router.post(
    "/logout/all",
    authMiddleware.checkAccessToken,
    authController.logoutAll,
);

export const authRouter = router;