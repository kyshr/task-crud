import express from "express";
import {
    deleteUser,
    getUser,
    getUserByToken,
    loginUserByCredentials,
    registerUser,
    updateUser
} from "../user/user.controller";
import { authenticated } from "../../config/passport.jwt.config";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUserByCredentials);

export default router;
