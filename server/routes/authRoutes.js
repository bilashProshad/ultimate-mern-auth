import express from "express";
import {
  accountActivation,
  facebookLogin,
  forgotPassword,
  googleLogin,
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
router.route("/google-login").post(googleLogin);
router.route("/facebook-login").post(facebookLogin);

export const authRoutes = router;
