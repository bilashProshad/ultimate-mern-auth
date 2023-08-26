import express from "express";
import { isAdmin, isAuthenticatedUser } from "../middlewares/auth.js";
import { update } from "../controllers/adminController.js";

const router = express.Router();

router.route("/update").put(isAuthenticatedUser, isAdmin, update);

export const adminRoutes = router;
