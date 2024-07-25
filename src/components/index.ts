import { Router } from "express";
import ApiResponse from "../interfaces/ApiResponse";
import userRouter from "./user/user.route";
import googleRouter from "./google/google.route";
import authRouter from "./auth/auth.route";
import facebookRouter from "./facebook/facebook.route";

const router = Router();

router.get<ApiResponse>("/", (req, res) => {
    res.json({
        message: "API - 👋🌎🌍🌏"
    });
});

router.use("/users", userRouter);
router.use("/auth", googleRouter, authRouter, facebookRouter);

export default router;
