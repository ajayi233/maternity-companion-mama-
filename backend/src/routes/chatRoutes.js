import express from 'express';
import { sendMessage, getSymptomAdvice } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/message', sendMessage);
router.post('/symptoms', getSymptomAdvice);

export default router;