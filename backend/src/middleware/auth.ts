import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AdminRole } from '@prisma/client';
import { AppError } from './errorHandler';

export interface AuthPayload {
  userId: number;
  email: string;
  role: AdminRole;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(new AppError(401, 'Missing or invalid Authorization header', 'UNAUTHORIZED'));
    return;
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    req.auth = payload;
    next();
  } catch {
    next(new AppError(401, 'Token expired or invalid', 'INVALID_TOKEN'));
  }
}

export function requireRole(...roles: AdminRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      next(new AppError(403, 'Insufficient permissions', 'FORBIDDEN'));
      return;
    }
    next();
  };
}
