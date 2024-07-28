import express from 'express';
import authRouter from "./auth/auth.routes";
import adminRoutes from "./admin/admin.routes";
import userRoutes from "./user/user.routes";
import UserAuthMiddleware from './middleware/UserAuthMiddleware';
import weblogRoutes from "./blog/weblog.routes";

const router = express.Router();
const getUser = require("./middleware/getUserFromCookie");
const checkTokens = require("./middleware/checkTokens");


router.use("/auth", authRouter);

router.use("/admin", UserAuthMiddleware, adminRoutes);

router.use("/user", getUser(), checkTokens(), UserAuthMiddleware, userRoutes);

router.use("/blog", UserAuthMiddleware,getUser(), weblogRoutes);


export default router;
