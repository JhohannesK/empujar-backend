import { PrismaClient, Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from "../services/sendEmailPasswordReset";

const prisma = new PrismaClient();

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, 'file-upload-user-key', { expiresIn: '1d' });
};

class AuthController {
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, role }: { email: string, password: string, role?: Role } = req.body;
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
          role: role ?? "user",
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
      console.log('Error in signup controller')
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password }: { email: string, password: string } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: {
          email
        }
      });
      if (!existingUser) {
        res.status(400).json({ message: 'Invalid credentials' });
        throw new Error('Invalid credentials');
      }

      const checkPassword = await bcrypt.compare(password, existingUser.password);
      if (!checkPassword) {
        res.status(400).json({ message: 'Invalid credentials' });
        throw new Error('Invalid credentials');
      }

      const token = generateToken(existingUser.id);
      res.status(200).json({ token, userId: existingUser.id, role: existingUser.role });
    } catch (error) {
      next(error)
    }
  }

  async requestPasswordReset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email }: { email: string } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: {
          email
        }
      });
      if (!existingUser) {
        res.status(400).json({ message: 'Invalid credentials' });
        throw new Error('Invalid credentials');
      }

      const resetToken = generateToken(existingUser.id);

      // Update user record with verification token
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          resetToken: resetToken,
          resetTokenExpiry: new Date().toISOString()
        },
      });

      // Send email with reset token
      await sendVerificationEmail(email, resetToken);

      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      next(error)
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { resetToken, password }: { resetToken: string, password: string } = req.body;

      const existingUser = await prisma.user.findFirst({
        where: {
          resetToken
        }
      })

      if (!existingUser || new Date(existingUser.resetTokenExpiry ?? '') < new Date()) {
        res.status(400).json({ error: 'Invalid or expired reset token' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null
        },
      })
    } catch (error) {

    }
  }
}

export default AuthController;