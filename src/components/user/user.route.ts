import express from "express";
import { deleteUser, getUser, getUserByToken, registerUser, updateUser } from "./user.controller";
import { authenticated } from "../../config/passport.jwt.config";

const router = express.Router();

router.get("/", authenticated, getUser);
router.get("/byToken", authenticated, getUserByToken);
router.post("/", registerUser);
router.put("/", authenticated, updateUser);
router.delete("/", authenticated, deleteUser);

export default router;
