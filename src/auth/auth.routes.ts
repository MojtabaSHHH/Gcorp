import express from "express";
import validator from "../utils/validator";
import UserAuthMiddleware from "../middleware/UserAuthMiddleware";
import { AUTH_CONTROLLER, AUTH_VALIDATOR } from ".";

const router = express.Router();

const getUser = require('../middleware/getUserFromCookie')
const checkTokens = require('../middleware/checkTokens')

router.post("/login", validator(AUTH_VALIDATOR.loginWithEmail ), AUTH_CONTROLLER.loginWithEmail);

router.post('/reset/verify', AUTH_CONTROLLER.verifyResetPasswordToken)

router.post('/reset/password',getUser(), checkTokens(), validator(AUTH_VALIDATOR.resetPassword ), AUTH_CONTROLLER.sendResetPasswordEmailHandler)

router.get("/logout", UserAuthMiddleware, AUTH_CONTROLLER.logout);

router.post("/token", AUTH_CONTROLLER.refreshToken);

router.get("/sign/:id", AUTH_CONTROLLER.generateTokens__dev);

export default router;
