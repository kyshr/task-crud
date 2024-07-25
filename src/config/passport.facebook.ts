import { Strategy } from "passport-facebook";
import appConfig from "./app.config";

export const facebookAuth = new Strategy(
    {
        clientID: appConfig.FACEBOOK_CLIENT_ID ?? "",
        clientSecret: appConfig.FACEBOOK_SECRET ?? "",
        callbackURL: "http://localhost:5000/api/auth/facebook/callback"
    },
    (accessToken: string, refreshToken: string, profile: any, cb: any) => {
        return cb(null, profile);
    }
);
