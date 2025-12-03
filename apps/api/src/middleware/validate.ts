// src/middleware/validate.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateBody =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "validation_error",
        message: "Invalid request body",
        issues: result.error.flatten(),
      });
    }

    req.body = result.data; // safe, parsed data
    next();
  };

/**
 * Validate query params
 */
export const validateQuery =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        error: "validation_error",
        message: "Invalid query parameters",
        issues: result.error.flatten(),
      });
    }

    req.query = result.data as any;
    next();
  };

/**
 * Validate URL params
 */
export const validateParams =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        error: "validation_error",
        message: "Invalid URL parameters",
        issues: result.error.flatten(),
      });
    }

    req.params = result.data as any;
    next();
  };
