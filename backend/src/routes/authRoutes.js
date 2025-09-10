import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe, updateProfile, changePassword, logout, sendPasswordResetCode, resetPasswordWithCode } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').isMobilePhone('en-GH').withMessage('Please provide a valid Ghanaian phone number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('dueDate').isISO8601().withMessage('Please provide a valid due date')
], register);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Too many login attempts, try again later' }
});

router.post('/login', loginLimiter, login);
router.post('/logout', logout);
const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { success: false, error: 'Too many reset attempts, try again later' }
});

router.post('/forgot-password', resetLimiter, sendPasswordResetCode);
router.post('/reset-password', resetPasswordWithCode);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;