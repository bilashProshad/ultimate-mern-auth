import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/User.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
import { sendActivationEmail } from "../utils/sendEmail.js";

// export const signup = catchAsyncErrors(async (req, res, next) => {
//   const { name, email, password } = req.body;

//   const user = await User.findOne({ email });
//   if (user) {
//     return next(new ErrorHandler(400, "Email is taken"));
//   }

//   let newUser = new User({ name, email, password });
//   await newUser.save();

//   res.status(201).json({
//     message: "Signup success! Please signin",
//   });
// });

export const signup = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler(400, "Email is taken"));
  }

  const token = jwt.sign(
    { name, email, password },
    process.env.JWT_ACCOUNT_ACTIVATION,
    { expiresIn: process.env.JWT_ACTIVATION_EXPIRE }
  );

  const emailData = {
    from: process.env.SMPT_MAIL,
    to: email,
    subject: "ACCOUNT ACTIVATION LINK",
    html: `
              <h1>Please use the following link to activate your account</h1>
              <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
              <hr />
              <p>This email may contain sensitive information</p>
              <p>${process.env.CLIENT_URL}</p>
          `,
  };

  const info = await sendActivationEmail(emailData);
  console.log(`Message sent: ${info.response}`);

  res.json({
    message: `Email has been sent to your email. Follow the instruction to activate your account`,
  });
});
