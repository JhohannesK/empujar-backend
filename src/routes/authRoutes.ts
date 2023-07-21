import express from 'express';
import AuthController from '../controllers/authController';

const router = express.Router();

const authController = new AuthController();

// POST /auth/{route}
router.post('/signup', authController.signup);
router.post('/login', authController.login)
router.post('/forgot-password', authController.requestPasswordReset)
router.post('/reset-password', authController.resetPassword)

export default router;