import express from 'express';
import { sendEmergencyNotification } from '../controllers/emergencyController.js';

const router = express.Router();

router.post('/notify', sendEmergencyNotification);

export default router;