import express from 'express';
import { updatePregnancyData, getPregnancyProgress } from '../controllers/pregnancyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.put('/data', updatePregnancyData);
router.get('/progress', getPregnancyProgress);

export default router;