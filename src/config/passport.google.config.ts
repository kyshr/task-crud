import { Strategy, VerifyCallback } from "passport-google-oauth20";
import appConfig from "./app.config";

export const googleOAuth = new Strategy(
    {
        clientID: appConfig.GOOGLE_ID ?? "",
        clientSecret: appConfig.GOOGLE_SECRET ?? "",
        callbackURL: "http://localhost:5000/api/auth/google/callback"
    },
    (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
        return done(null, profile);
    }
);
