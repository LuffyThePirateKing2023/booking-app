import express from "express";
import { forgotPass, login, register, resetpassword } from "../controller/authentication.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/forgotpassword", forgotPass)
router.post("/resetpassword/:id/:token", resetpassword)

export default router