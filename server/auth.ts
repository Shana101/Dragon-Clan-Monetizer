import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/api/seed",
  "/api/azure/status",
];

export interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
    creatorId?: string;
    [key: string]: any;
  };
}

/**
 * JWT Auth Middleware
 * Uses the same JWT_SECRET as DCTV auth.mjs and Heidi Studio for SSO.
 * Skip if JWT_SECRET is not configured (allows development without auth).
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  // Skip non-API routes
  if (!req.path.startsWith("/api/")) {
    next();
    return;
  }

  // Skip public routes
  if (PUBLIC_ROUTES.some((r) => req.path === r)) {
    next();
    return;
  }

  // If no JWT_SECRET, auth is disabled (development mode)
  if (!JWT_SECRET) {
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing or invalid Authorization header" });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      email: decoded.email,
      creatorId: decoded.creatorId || decoded.sub,
      ...decoded,
    };
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired" });
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
  }
}
