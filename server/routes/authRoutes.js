import express from "express";
import { signup } from "../controllers/authControllers.js";

const router = express.Router();

router.route("/signup").get(signup);

export const authRoutes = router;
