import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, 'your-secret-key', { expiresIn: '1d' });
};

class AuthController {
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, role }: { email: string, password: string, role?: string } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await prisma.user.findUnique({
        where: {
          email
        }
      });

      if (existingUser) {
        res.status(400).json({ message: 'Email already exists' });
        throw new Error('Email already in use');
      }

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          resetToken: null,
          resetTokenExpiry: null
        }
      });

      const token = generateToken(newUser.id);

      // Update user record with verification token
      await prisma.user.update({
        where: { id: newUser.id },
        data: { resetToken: token },
      });

      res.status(201).json({ token, userId: newUser.id });

    }
    catch (err) {
      next(err);
    }
  }
}

export default AuthController;