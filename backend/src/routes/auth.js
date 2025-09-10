import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  changePassword, 
  logout, 
  sendPasswordResetCode, 
  resetPasswordWithCode 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', sendPasswordResetCode);
router.post('/reset-password', resetPasswordWithCode);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;