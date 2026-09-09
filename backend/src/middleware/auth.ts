import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserProfile } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'genericmed-secure-jwt-secret-key-2026';

export interface AuthRequest extends Request {
  user?: UserProfile;
}

export function generateToken(user: UserProfile): string {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      roleTitle: user.roleTitle,
      orgName: user.orgName
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({
      error: 'Authentication required. No token provided.',
      code: 'UNAUTHORIZED'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserProfile;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({
      error: 'Invalid or expired authentication token.',
      code: 'INVALID_TOKEN'
    });
  }
}

export function optionalAuthenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as UserProfile;
      req.user = decoded;
    } catch {
      // Ignore for optional auth
    }
  }
  next();
}

export function requireRole(allowedRoles: UserProfile['role'][]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required.',
        code: 'UNAUTHORIZED'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: `Access denied. Role '${req.user.role}' is not authorized for this resource.`,
        code: 'FORBIDDEN'
      });
      return;
    }

    next();
  };
}
