import express from "express";
import passport from "passport";
import { authenticateFacebook, authenticateFacebookFailure } from "./facebook.controller";

const router = express.Router();

router.get("/facebook", passport.authenticate("facebook"));
router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
        failureRedirect: "/facebook/failure",
        session: false
    }),
    authenticateFacebook
);

router.get("/facebook/failure", authenticateFacebookFailure);

export default router;
