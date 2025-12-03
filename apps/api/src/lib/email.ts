// src/utils/mailer.ts
import nodemailer from "nodemailer";
import { env } from "../env";

// Create transporter using env variables
export const mailer = nodemailer.createTransport({
  host: env.EMAIL_SMTP_HOST,
  port: env.EMAIL_SMTP_PORT,
  secure: env.EMAIL_SECURE, // true for 465, false for other ports
  auth: {
    user: env.EMAIL_SMTP_USER,
    pass: env.EMAIL_SMTP_PASS,
  },
});

// Send verification email
export async function sendVerificationEmail(to: string, code: string) {
  return sendGenericEmail(
    to,
    "Verify your email",
    `<p>Your verification code is <b>${code}</b></p>`
  );
}

// Generic email sender
export async function sendGenericEmail(to: string, subject: string, html: string) {
  return mailer.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}
