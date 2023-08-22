import express from "express";
import { signup } from "../controllers/authControllers.js";
import { userSignupValidator } from "../validators/auth.js";
import { runValidator } from "../validators/index.js";

const router = express.Router();

router.route("/signup").post(userSignupValidator, runValidator, signup);

export const authRoutes = router;
