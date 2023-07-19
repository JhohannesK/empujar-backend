import { Role } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
   user: { role: Role };
}


export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
   const userRole = req.user.role;
   console.log("🚀 ~ file: adminMiddleware.ts:11 ~ isAdmin ~ userRole:", userRole)

   if (userRole !== 'admin') {
      res.status(403).json({ error: 'Unauthorized' });
      return;
   }

   next();
};
