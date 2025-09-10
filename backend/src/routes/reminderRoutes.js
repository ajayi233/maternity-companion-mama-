import express from 'express';
import { getReminders, createReminder, updateReminder } from '../controllers/reminderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getReminders)
  .post(createReminder);

router.put('/:id', updateReminder);

export default router;