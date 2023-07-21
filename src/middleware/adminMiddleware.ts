import { Request, Response, NextFunction } from 'express';

export const isAdmin = ({ role }: { role: string }): void => {
   if (role !== 'admin') {
      throw new Error('Not authorized as an admin');
   }
   else {
      throw new Error('Authorized as an admin');
   }

};
