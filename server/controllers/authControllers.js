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
