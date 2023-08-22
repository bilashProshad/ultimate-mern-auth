import nodemailer from "nodemailer";

export const sendActivationEmail = async (emailData) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_APP_PASS,
    },
  });

  return await transporter.sendMail(emailData);
};
