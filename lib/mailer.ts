"use server";

import nodemailer from "nodemailer";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const sendEmail = async ({ email, userId }: any) => {
  try {
    const hashToken = await bcrypt.hash(userId.toString(), 10);

    const user = await User.findByIdAndUpdate(userId, {
      verifyToken: hashToken,
      verifyTokenExpiry: Date.now() + 3600000,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailOptions = {
      from: `${process.env.NODEMAILER_USER}`,
      to: email,
      subject: "Verify your Email",
      html: `<p>Click <a href="${process.env.DOMAIN}/VerifyEmail?token=${hashToken}">here</a> to verify your email</p>`,
    };

    const mailRes = await transporter.sendMail(mailOptions);
    return mailRes;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function sendEmailFromServer({ email, userId }: any) {
  const res = await sendEmail({ email, userId });
  return res;
}
