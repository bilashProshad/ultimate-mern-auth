import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

export const update = catchAsyncErrors(async (req, res, next) => {
  res.send("Admin Updated");
});
