import { User } from "../models/User.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";

export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return next(new ErrorHandler(401, "Please login to access this resource"));
  }

  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return next(new ErrorHandler(401, "Please login to access this resource"));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  // req.user = await User.findById(decodedData._id);
  req.user = decodedData;

  next();
});

export const isAdmin = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }

  if (user.role !== "admin") {
    return next(new ErrorHandler(403, "Admin resource. Access denied."));
  }

  req.profile = user;
  next();
});
