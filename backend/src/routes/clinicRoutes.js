import express from 'express';
import { getNearbyclinics, getClinicById, searchClinics } from '../controllers/clinicController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/nearby', getNearbyclinics);
router.get('/search', searchClinics);
router.get('/:id', getClinicById);

export default router;