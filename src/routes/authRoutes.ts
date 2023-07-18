import express from 'express';
import AuthController from '../controllers/authController';

const router = express.Router();

const authController = new AuthController();

// POST /auth/signup
router.post('/signup', authController.signup);
router.post('/login', authController.login)

export default router;