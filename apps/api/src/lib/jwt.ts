// src/lib/jwt.ts
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../env";

const SECRET = env.JWT_SECRET as string; // <-- IMPORTANT FIX

export function signJwt(
  payload: Record<string, any>,
  expiresIn: SignOptions["expiresIn"] = "7d"
) {
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
