import express from "express";
import { profile, update } from "../controllers/userController.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

router.route("/:id").get(isAuthenticatedUser, profile);
router.route("/update").put(isAuthenticatedUser, update);

export const userRoutes = router;
