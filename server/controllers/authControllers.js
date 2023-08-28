import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/User.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
import { sendActivationEmail } from "../utils/sendEmail.js";
import { OAuth2Client } from "google-auth-library";

export const signup = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler(400, "This email is taken"));
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
    message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
  });
});

export const accountActivation = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return next(new ErrorHandler(401, "Invalid token. Signup again."));
  }

  const decodedData = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
  const { name, email, password } = decodedData;

  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler(400, "This email is taken. Signup again."));
  }

  user = await User.create({ name, email, password });
  if (!user) {
    return next(
      new ErrorHandler(401, "Error saving user in database. Try signup again")
    );
  }

  res.status(201).json({
    message: "Signup success. Please signin.",
  });
});

export const signin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    return next(
      new ErrorHandler(
        400,
        "User with that email does not exist. Please signup."
      )
    );
  }

  if (!user.authenticate(password)) {
    return next(new ErrorHandler(400, "Invalid email or password"));
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const { _id, name, role } = user;

  res.json({
    token,
    user: {
      _id,
      name,
      role,
      email: user.email,
    },
  });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler(404, "User with that email does not exist"));
  }

  const token = jwt.sign(
    { _id: user._id, name: user.name },
    process.env.JWT_RESET_PASSWORD,
    {
      expiresIn: process.env.JWT_ACTIVATION_EXPIRE,
    }
  );

  const emailData = {
    from: process.env.SMPT_MAIL,
    to: email,
    subject: "PASSWORD RESET LINK",
    html: `
              <h1>Please use the following link to reset your password</h1>
              <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
              <hr />
              <p>This email may contain sensitive information</p>
              <p>${process.env.CLIENT_URL}</p>
          `,
  };

  const info = await sendActivationEmail(emailData);
  console.log(`Message sent: ${info.response}`);

  user.resetPasswordToken = token;
  await user.save();

  res.json({
    message: `Email has been sent to ${email}. Follow the instruction to reset your account`,
  });
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { resetPasswordToken, newPassword } = req.body;

  if (!resetPasswordToken) {
    return next(new ErrorHandler(400, "Token not found or invalid token"));
  }

  jwt.verify(resetPasswordToken, process.env.JWT_RESET_PASSWORD);

  const user = await User.findOne({ resetPasswordToken });
  if (!user) {
    return next(new ErrorHandler(400, "Something went wrong. Try later"));
  }

  user.password = newPassword;
  user.resetPasswordToken = "";
  await user.save();

  res.json({
    message: "Great! Now you can login with your new password",
  });
});

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
export const googleLogin = catchAsyncErrors(async (req, res, next) => {
  const { credential } = req.body;

  const ticket = await oAuth2Client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { email, name, email_verified } = ticket.getPayload();

  if (!email_verified) {
    return next(new ErrorHandler(400, "Google login failed. Try again!"));
  }

  let user = await User.findOne({ email });
  if (!user) {
    let password = email + process.env.JWT_SECRET;
    user = await User.create({ email, name, password });
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const { _id, role } = user;

  res.send({ token, user: { _id, email, name, role } });
});
