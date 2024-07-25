import dotenv from "dotenv";

dotenv.config();

interface AppConfig {
    NODE_ENV: string;
    PORT: number;
    MONGO_URI: string;
    APP_SECRET: string;
    GOOGLE_ID: string;
    GOOGLE_SECRET: string;
    FACEBOOK_CLIENT_ID: string;
    FACEBOOK_SECRET: string;
    IMAGEKIT_PUBLIC_KEY: string;
    IMAGEKIT_PRIVATE_KEY: string;
    IMAGE_KIT_ID: string;
}

const appConfig: AppConfig = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: Number(process.env.PORT) ?? 5000,
    MONGO_URI: process.env.MONGO_URI ?? "",
    APP_SECRET: process.env.APP_SECRET ?? "",
    GOOGLE_ID: process.env.GOOGLE_ID ?? "",
    GOOGLE_SECRET: process.env.GOOGLE_SECRET ?? "",
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID ?? "",
    FACEBOOK_SECRET: process.env.FACEBOOK_SECRET ?? "",
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY ?? "",
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY ?? "",
    IMAGE_KIT_ID: process.env.IMAGE_KIT_ID ?? ""
};

export default appConfig;
