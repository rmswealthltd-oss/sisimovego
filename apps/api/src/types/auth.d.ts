// src/types/auth.d.ts
export interface AuthUser {
  id: string;
  email: string | null;
  role: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
}


import * as express from "express";

export interface AuthRequest extends express.Request {
  user?: AuthUser;
}
