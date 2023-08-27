import express from "express";
import {
  accountActivation,
  forgotPassword,
  resetPassword,
  signin,
  signup,
} from "../controllers/authControllers.js";
import {
  forgotPasswordValidator,
  resetPasswordValidator,
  userSigninValidator,
  userSignupValidator,
} from "../validators/auth.js";
import { runValidator } from "../validators/index.js";

const router = express.Router();

router.route("/signup").post(userSignupValidator, runValidator, signup);
router.route("/account-activation").post(accountActivation);
router.route("/signin").post(userSigninValidator, runValidator, signin);
router
  .route("/password/forgot")
  .put(forgotPasswordValidator, runValidator, forgotPassword);
router
  .route("/password/reset")
  .put(resetPasswordValidator, runValidator, resetPassword);

export const authRoutes = router;
