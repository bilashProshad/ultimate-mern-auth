import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/User.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";

export const update = catchAsyncErrors(async (req, res, next) => {
  const { name, password } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }

  if (name) {
    user.name = name;
  }

  if (password) {
    user.password = password;
  }

  await user.save();

  const updatedUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res.status(200).json({ user: updatedUser });
});
