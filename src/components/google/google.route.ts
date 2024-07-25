import express from "express";
import passport from "passport";
import { authenticateGoogle, authenticateGoogleFailure } from "./google.controller";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/google/failure",
        session: false
    }),
    authenticateGoogle
);

router.get("/google/failure", authenticateGoogleFailure);

export default router;
