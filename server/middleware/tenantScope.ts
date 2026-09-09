import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export interface TenantRequest extends AuthRequest {
  tenantId?: string;
}

export function tenantScopeMiddleware(req: TenantRequest, res: Response, next: NextFunction): void {
  const tenantHeader = req.headers['x-tenant-id'];

  if (typeof tenantHeader === 'string' && tenantHeader.trim().length > 0) {
    req.tenantId = tenantHeader.trim();
  } else if (req.user && (req.user as unknown as { tenantId?: string }).tenantId) {
    req.tenantId = (req.user as unknown as { tenantId?: string }).tenantId;
  }

  next();
}
