import express from 'express';
import HealthcareFacilitiesController from '../controllers/healthServiceController.js';

const router = express.Router();
const healthcareController = new HealthcareFacilitiesController();

// Test endpoint
router.get('/test', healthcareController.testEndpoint.bind(healthcareController));

// Health check endpoint
router.get('/health', healthcareController.healthCheck.bind(healthcareController));

// Get healthcare facilities
router.get('/facilities', healthcareController.getFacilities.bind(healthcareController));

// Mock data endpoint (for testing without API calls)
router.get('/facilities/mock', healthcareController.getMockFacilities.bind(healthcareController));

export default router;