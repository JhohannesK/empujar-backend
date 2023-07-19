import { Role } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
   user: { role: Role };
}


export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
   const { role } = req.body;
   console.log("🚀 ~ file: adminMiddleware.ts:11 ~ isAdmin ~ role:", req.body)

   if (role !== 'admin') {
      res.status(403).json({ error: 'Unauthorized' });
      throw new Error('Not authorized as an admin');
      return;
   }

   next();
};
