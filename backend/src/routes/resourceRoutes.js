import express from 'express';
import { getEducationalResources } from '../controllers/resourceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/educational', getEducationalResources);

export default router;