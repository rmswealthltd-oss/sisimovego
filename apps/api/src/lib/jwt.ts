// src/lib/jwt.ts
import jwt from "jsonwebtoken";
import { env } from "../env";

export function signJwt(payload: object, expiresIn: string | number = "7d") {
  return jwt.sign(payload as any, env.JWT_SECRET, { expiresIn });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}
