import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { isAdmin } from './adminMiddleware';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {

   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: Header' });
      return;
   }

   const token = authHeader.split(' ')[1];
   if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      throw new Error('No Bearer token found');
      return;
   }

   try {
      const decoded = jwt.verify(token, 'file-upload-user-key') as JwtPayload
      const role = decoded.role
      console.log("🚀 ~ file: authenticateTokes.ts:23 ~ authenticateToken ~ decoded:", decoded)
      isAdmin({ role })
      next();

   } catch (error) {
      res.status(401).json({ error: 'Unauthorized' });
      throw new Error('Not authorized, token failed');
   }
};
