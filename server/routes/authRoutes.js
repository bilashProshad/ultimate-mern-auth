import express from "express";
import {
  accountActivation,
  signin,
  signup,
} from "../controllers/authControllers.js";
import {
  userSigninValidator,
  userSignupValidator,
} from "../validators/auth.js";
import { runValidator } from "../validators/index.js";

const router = express.Router();

router.route("/signup").post(userSignupValidator, runValidator, signup);
router.route("/account-activation").post(accountActivation);
router.route("/signin").post(userSigninValidator, runValidator, signin);

export const authRoutes = router;
