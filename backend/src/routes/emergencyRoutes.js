import express from 'express';
import { triggerEmergency } from '../controllers/emergencyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/alert', triggerEmergency);

export default router;