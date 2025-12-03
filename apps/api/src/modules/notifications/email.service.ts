// src/modules/notifications/email.service.ts
import { env } from "../../env";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: env.EMAIL_SMTP_HOST,
  port: Number(env.EMAIL_SMTP_PORT),
  auth: {
    user: env.EMAIL_SMTP_USER, // fixed
    pass: env.EMAIL_SMTP_PASS, // fixed
  },
  secure: env.EMAIL_SECURE, // optional: true for port 465
});

export const EmailService = {
  async sendEmail(to: string, subject: string, html: string) {
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    });
  },

  async sendVerificationEmail(to: string, code: string) {
    const html = `<p>Your verification code is <b>${code}</b></p>`;
    await this.sendEmail(to, "Verify your SisiMove Account", html);
  },

  async sendTripUpdate(to: string, message: string) {
    await this.sendEmail(to, "Trip Update", `<p>${message}</p>`);
  },
};
