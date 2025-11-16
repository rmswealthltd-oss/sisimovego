// src/lib/email.ts
import { EmailService } from "../modules/notifications/email.service";

/**
 * Lightweight wrapper to keep imports stable across codebase.
 */
export async function sendVerificationEmail(to: string, code: string) {
  return EmailService.sendVerificationEmail(to, code);
}

export async function sendGenericEmail(to: string, subject: string, html: string) {
  return EmailService.sendEmail(to, subject, html);
}
